export function initializeAddFilter() {
  document.getElementById('addButton').addEventListener('click', function() {
    // Kloon de eerste card
    var originalCard = document.querySelector('.card');
    var clonedCard = originalCard.cloneNode(true);

    // Voeg een "Verwijder" knop toe
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Verwijder';
    deleteButton.addEventListener('click', function() {
      // Verwijder de corresponderende filterkaart
      clonedCard.remove();
    });

    // Voeg de "Verwijder" knop toe aan de gekloonde kaart
    clonedCard.appendChild(deleteButton);

    // Pas de tekst in de header aan (Item #1, Item #2, ...)
    var cardHeaders = document.querySelectorAll('.card_header h3');
    var newCardNumber = cardHeaders.length + 1;
    clonedCard.querySelector('.card_header h3').textContent = 'Item #' + newCardNumber;

    // Voeg de gekloonde kaart toe aan de container
    document.getElementById('cardsContainer').appendChild(clonedCard);
  });
}
