export function initializeAddFilter() {
    document.getElementById('addButton').addEventListener('click', function() {
      // Kloon de eerste card
      var originalCard = document.querySelector('.card');
      var clonedCard = originalCard.cloneNode(true);
  
      // Pas de tekst in de header aan (Item #1, Item #2, ...)
      var cardHeaders = document.querySelectorAll('.card_header h3');
      var newCardNumber = cardHeaders.length + 1;
      clonedCard.querySelector('.card_header h3').textContent = 'Item #' + newCardNumber;
  
      // Voeg de gekloonde card toe aan de container
      document.getElementById('cardsContainer').appendChild(clonedCard);
    });
  }
  