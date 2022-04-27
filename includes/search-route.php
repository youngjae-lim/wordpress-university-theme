<?php

function university_register_search() {
    register_rest_route('university/v1', 'search', array(
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'university_search_results'
    ));
}

function university_search_results() {
    return 'search result';
}

add_action('rest_api_init', 'university_register_search');