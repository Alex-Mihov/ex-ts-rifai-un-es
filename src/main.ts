// Definizione del tipo di dati che verrà restituito dalla dashboard
// Contiene informazioni su città, paese, temperatura, meteo e aeroporto
type DashboardData = {
  city: string;
  country: string;
  temperature: number;
  weather: string;
  airport: string;
};


// Funzione asincrona che recupera e combina dati da diverse API per una dashboard
async function getDashboardData(query: string): Promise<DashboardData> {
  try {
    // Esegue tre chiamate API in parallelo usando Promise.all per ottimizzare i tempi
    const [destinationsRes, weatherRes, airportRes] = await Promise.all([
      fetch(`http://localhost:3333/destinations?search=${query}`), // API destinazioni
      fetch(`http://localhost:3333/weathers?search=${query}`),    // API meteo
      fetch(`http://localhost:3333/airports?search=${query}`)     // API aeroporti
    ]);

    // Converte tutte le risposte in formato JSON in parallelo
    const [destinations, weathers, airports] = await Promise.all([
      destinationsRes.json(),
      weatherRes.json(),
      airportRes.json()
    ]);

    // Estrae il primo risultato da ogni array di risposte
    const destination = destinations[0];
    const weather = weathers[0];
    const airport = airports[0];

    // Verifica che tutti i dati necessari siano presenti
    if (!destination || !weather || !airport) {
      throw new Error("Dati incompleti");
    }

    // Costruisce l'oggetto risultato con i dati raccolti
    const result: DashboardData = {
      city: destination.name,
      country: destination.country,
      temperature: weather.temperature,
      weather: weather.weather_description,
      airport: airport.name
    };

    // Stampa i risultati in console in due formati diversi
    console.log('Dashboard data:', result);
    console.log(
      `${result.city} is in ${result.country}.\n` +
      `Today there are ${result.temperature} degrees and the weather is ${result.weather}.\n` +
      `The main airport is ${result.airport}.\n`
    );

    return result;

  } catch (error) {
    // Gestione degli errori: logga l'errore e lo propaga
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}

// Esempio di utilizzo della funzione con la città di Londra
getDashboardData('london')
  .then()
  .catch(err => console.error(err));
