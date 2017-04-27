
/**
 * This file match URI to route names.
 * If you edit this file you may want to edit
 * - the menu in components/partials/AdminMenu.jsx
 * - the content in components/homepages/AdminHomepage.jsx
 */

export default [
    { name: 'home', path: '/'},
    { name: 'alert', path: '/alert', title: 'Alertes'},
    { name: 'bars', path: '/bars', title: 'Bars' },
    { name: 'chat', path: '/chat', title: 'Chat' },
        { name: 'chat.channel', path: '/:channel', title: (route) => {
            switch(route.params.channel.split(':')[0]) {
                case 'public': return 'Publique : ' + route.params.channel.split(':')[1];
                case 'group': return 'Groupe : ' + route.params.channel.split(':')[1];
                case 'private': return 'Privé : ' + route.params.channel.split(':')[1];
                default: return 'Chat';
            }
        }},
    { name: 'stock', path: '/stock', title: 'Gestion du stock' },
    { name: 'admin', path: '/admin', title: 'Administration' },
        { name: 'admin.teams', path: '/team', title: 'Gestion des équipes' },
            { name: 'admin.teams.id', path: '/:id', title: 'Gestion des équipes' },
        { name: 'admin.barrels', path: '/barrel', title: 'Gestion des fûts' },
        { name: 'admin.alerts', path: '/alerts', title: 'Gestion des alertes' },
];
