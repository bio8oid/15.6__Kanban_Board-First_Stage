'use strict';
(() => {

  document.addEventListener('DOMContentLoaded', () => {

    // Board \\

    const board = {
      name: 'Kanban Board',
      addColumn: function(column) {
        this.element.appendChild(column.element);
        initSortable(column.id);
      },
      element: document.querySelector('#board .column-container')
    };

    // ID Generator \\

    const randomString = () => {
      const chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
      let str = '';
      while (str < 10) {
        str += chars[Math.floor(Math.random() * chars.length)];
      }
      return str;
    }

    // Template Generator \\

    const generateTemplate = (name, data, basicElement) => {
      const template = document.getElementById(name).innerHTML;
      const element = document.createElement(basicElement || 'div');

      Mustache.parse(template);
      element.innerHTML = Mustache.render(template, data);

      return element;
    }

    // Column Class \\

    function Column(name) {

      this.id = randomString();
      this.name = name;
      this.element = generateTemplate('column-template', { name: this.name, id: this.id });

      this.element.querySelector('.column').addEventListener('click', event => {
        if (event.target.classList.contains('btn-delete')) {
          this.removeColumn();
        }

        if (event.target.classList.contains('add-card')) {
          this.addCard(new Card(prompt("Enter the name of the card")));
        }
      });
    }

    Column.prototype = {
      addCard: function (card) {
        this.element.querySelector('ul').appendChild(card.element);

      },
      removeColumn: function () {
        this.element.parentNode.removeChild(this.element);
      }
    };

    // Card Class \\

    function Card(description) {

      this.id = randomString();
      this.description = description;
      this.element = generateTemplate('card-template', { description: this.description }, 'li');
      if (description.length > 25) {
        this.element.querySelector('.card').classList.add("green");
      }
      if (description.length > 35) {
        this.element.querySelector('.card').classList.add("blue");
      }
      this.element.querySelector('.card').addEventListener('click', event => {
        event.stopPropagation();

        if (event.target.classList.contains('btn-delete')) {
          this.removeCard();
        }
      });
    }

    Card.prototype = {
      removeCard: function () {
        this.element.parentNode.removeChild(this.element);
      }
    }

    // Sortable \\

    const initSortable = id => {
      const el = document.getElementById(id);
      const sortable = Sortable.create(el, {
        group: 'kanban',
        sort: true
      });
    }

    document.querySelector('#board .create-column').addEventListener('click', () => {
      const name = prompt('Enter a column name');
      const column = new Column(name);
      board.addColumn(column);
    });

    // CREATING COLUMNS
    const todoColumn = new Column('To do');
    const doingColumn = new Column('Doing');
    const doneColumn = new Column('Done');

    // ADDING COLUMNS TO THE BOARD
    board.addColumn(todoColumn);
    board.addColumn(doingColumn);
    board.addColumn(doneColumn);

    // CREATING CARDS
    const card1 = new Card('New task');
    const card2 = new Card('Well');
    const card3 = new Card('Whatever');

    // ADDING CARDS TO COLUMNS
    todoColumn.addCard(card1);
    doingColumn.addCard(card2);
    doneColumn.addCard(card3);

  });
})(); 