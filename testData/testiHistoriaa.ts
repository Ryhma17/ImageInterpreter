
export interface HistoryItemType {
    id: string;
    image: any;
    date: string;
    location: {
        latitude: number;
        longitude: number;
    } | null;
    title: string;
    subtitle: string;
}

export const TESTI_HISTORIA: HistoryItemType[] = [
    {
        id: '1',
        image: require('../Documents/UI design/Analyze.png'),
        date: 'Today, 2:30 PM',
        location: { latitude: -3.4653, longitude: -62.2159 },
        title: 'Identify the plant',
        subtitle: 'IT\'S PEIKONLEHTI, which is a typical houseplant',
    },
    {
        id: '2',
        image: require('../Documents/UI design/DetailsModal.png'),
        date: 'Yesterday, 10:15 AM',
        location: null,
        title: 'Identify the food',
        subtitle: 'Seems to be a good looking hamburger',
    },
    {
        id: '3',
        image: require('../Documents/UI design/HistoryPage.png'),
        date: 'Jan 10, 5:45 PM',
        location: null,
        title: 'What kind of dog is this?',
        subtitle: 'It looks like a Golden Retriever puppy.',
    },
    {
        id: '4',
        image: require('../Documents/UI design/HistoryPage.png'),
        date: 'Jan 08, 2:15 PM',
        location: { latitude: 60.1704, longitude: 24.9522 },
        title: 'What building is this?',
        subtitle: 'This is the Helsinki Cathedral (Helsingin tuomiokirkko), a famous landmark.',
    },
    {
        id: '5',
        image: require('../Documents/UI design/HistoryPage.png'),
        date: 'Jan 05, 9:30 AM',
        location: { latitude: 60.2000, longitude: 24.9000 },
        title: '"Diagnose this dashboard light"',
        subtitle: 'The symbol indicates low tire pressure. You should check your tires.',
    },
    {
        id: '6',
        image: require('../Documents/UI design/HistoryPage.png'),
        date: 'Dec 28, 8:45 PM',
        location: { latitude: 60.1000, longitude: 24.8000 },
        title: 'Summarize this page',
        subtitle: 'The text discusses the history of Finland',
    },
    {
        id: '7',
        image: require('../Documents/UI design/HistoryPage.png'),
        date: 'Dec 24, 6:00 PM',
        location: null,
        title: 'Recipe for these ingredients',
        subtitle: 'Based on the image (eggs, flour, milk), you can make pancakes or waffles.',
    },
    {
        id: '8',
        image: require('../Documents/UI design/HistoryPage.png'),
        date: 'Dec 20, 11:20 AM',
        location: { latitude: 60.3000, longitude: 24.6000 },
        title: 'Is this mushroom poisonous?',
        subtitle: 'Caution: This looks like a Fly Agaric (Amanita muscaria). It is toxic.',
    },
];