'use strict';
/* global $ */

const STORE = {
  items : [
    {name: 'apples', checked: false},
    { name: 'oranges', checked: false },
    { name: 'milk', checked: true },
    { name: 'bread', checked: false }],
  hideCheckedItems : false,
  filtered : '',
};


function generateItemElement(item, itemIndex, template) {
  return `

    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
          <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
          <span class="button-label">delete</span>
        </button>
        <form id="js-shopping-item-form">
          <input type="text" name="shopping-list-edit" class="js-shopping-list-edit" placeholder="Rename item here">
          <button type="submit" class="js-shopping-item-edit">edit</button>
          </form> 
      </div>
    </li>`;
}

function generateShoppingItemsString(shoppingList) {
  const items = shoppingList.map((item, index) => generateItemElement(item,index));
  return items.join('');
}

function renderShoppingList() {
  let filteredItems = STORE.items;
  if (STORE.hideCheckedItems === true) {
    filteredItems = STORE.items.filter(function(item) {
      return item.checked === false;
    });
  }
  if (STORE.filtered !== '') {
    filteredItems = STORE.items.filter(function (item) {
      return item.name === STORE.filtered;    
    });
  }
  $('.js-shopping-list-query').val('');
  const shoppingListItemsString = generateShoppingItemsString(filteredItems);
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  STORE.items.push({name: itemName, checked: false});
}

function handleAddItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();    
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function getItemIndexFromElement(item) {
  const itemIndexString = $(item).closest('.js-item-index-element').attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click','.js-item-toggle', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function editItemName (itemIndex, newName) {
  STORE.items[itemIndex].name = newName;
}

function handleEditItem() {
  $('.js-shopping-list').on('submit', '#js-shopping-item-form', function (event) {
    event.preventDefault();
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    const newName = $('.js-shopping-list-edit').val();
    console.log(newName);
    editItemName(itemIndex, newName);
    renderShoppingList();
  });
}

function deleteItemList (itemIndex) {
  STORE.items.splice(itemIndex, 1);
}

function handleDeleteItemClicked() {
  
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteItemList(itemIndex);
    renderShoppingList();
  });
}

function handleCheckedOnlyBox () {
  $('#filterChecked').on('change', () => {
    STORE.hideCheckedItems = !STORE.hideCheckedItems;
    renderShoppingList();
  });
}

function searchShoppingList(itemName) {
  //search array for items with matching name
  $('#js-shopping-list-search-form').submit(function(event){
    event.preventDefault();
    const searchItemName = $('.js-shopping-list-query').val();
    STORE.filtered = searchItemName;
    renderShoppingList();
  });
}

function handleBackToMain() {
  $('.js-back-to-main').click(function(){
    console.log(STORE.filtered);
    STORE.filtered = '';
    console.log(STORE.filtered);
    renderShoppingList();
  });
}

function handleShoppingList() {
  renderShoppingList();
  handleAddItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleCheckedOnlyBox();
  searchShoppingList();
  handleBackToMain();
  handleEditItem();
}

$(handleShoppingList);