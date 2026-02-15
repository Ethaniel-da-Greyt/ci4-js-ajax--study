<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'TodoController::index');
$routes->post('/todo/store', 'TodoController::store');
$routes->get('/todo/fetch-all', 'TodoController::fetchAll');
$routes->get('/todo/delete/(:num)', 'TodoController::delete/$1');
$routes->get('/todo/update-fetch/(:num)', 'TodoController::fetchById/$1');
$routes->put('/todo/update/(:num)', 'TodoController::update/$1');
// $routes->get('/todo/mark-done/(:num)', 'TodoController::markDone/$1');
$routes->post('/todo/mark-done-bulk', 'TodoController::markDoneBulk');
$routes->post('/todo/delete-bulk', 'TodoController::deleteBulk');