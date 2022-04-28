<?php

function university_register_search() {
    register_rest_route('university/v1', 'search', array(
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'university_search_results'
    ));
}

function university_search_results() {
    $professors = new WP_Query(array(
        'post_type' => 'professor'
    ));

    $professorResults = array();

    while($professors->have_posts()) {
        $professors->the_post();
        array_push($professorResults, array(
            'title' => get_the_title(),
            'permalink' => get_the_permalink()
        ));
    }

    return $professorResults;
}

add_action('rest_api_init', 'university_register_search');