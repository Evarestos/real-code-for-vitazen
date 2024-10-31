# Wellness App

## Εγκατάσταση

1. Κλωνοποιήστε το repository
2. Εκτελέστε `npm install`
3. Αντιγράψτε το `.env.example` σε `.env` και συμπληρώστε τις μεταβλητές περιβάλλοντος

## Εκτέλεση

- Development: `npm run dev`
- Production: `npm start`

## Testing

Εκτελέστε `npm test` για να τρέξετε τα tests

## Deployment

1. Βεβαιωθείτε ότι όλες οι μεταβλητές περιβάλλοντος είναι ρυθμισμένες
2. Εκτελέστε `npm run build` για να κάνετε lint και να τρέξετε τα tests
3. Εκτελέστε `npm start` για να ξεκινήσετε τον server

## API Documentation

[Εδώ θα μπορούσαμε να προσθέσουμε ένα link σε ένα αρχείο API documentation]

## CI/CD

Αυτό το project χρησιμοποιεί GitHub Actions για CI/CD. Κάθε push στο main branch ενεργοποιεί αυτόματα tests και deployment στο Heroku.

## Backups

Για να δημιουργήσετε ένα backup της βάσης δεδομένων, τρέξτε:
