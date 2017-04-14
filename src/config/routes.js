
/**
 * This file match URI to route names.
 * If you edit this file you may want to edit
 * - the menu in components/partials/AdminMenu.jsx
 * - the content in components/homepages/AdminHomepage.jsx
 */

export default [
    { name: 'home',          path: '/' },
    { name: 'bars',          path: '/bars' },
    { name: 'stock',         path: '/stock' },
    { name: 'admin',         path: '/admin' },
        { name: 'admin.teams',   path: '/team' },
            { name: 'admin.teams.id',   path: '/:id' },
        { name: 'admin.barrels', path: '/barrel' },
        { name: 'admin.alerts',  path: '/alerts' },
];
