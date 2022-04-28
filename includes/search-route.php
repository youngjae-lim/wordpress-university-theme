<?php

function university_register_search() {
    register_rest_route('university/v1', 'search', array(
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'university_search_results'
    ));
}

function university_search_results($data) {
    $mainQuery = new WP_Query(array(
        'post_type' => array('post', 'page', 'professor', 'program', 'event', 'campus'),
        's' => sanitize_text_field($data['keyword'])
    ));

    $results = array(
        'generalInfo' => array(),
        'professors' => array(),
        'programs' => array(),
        'events' => array(),
        'campuses' => array()
    );

    while($mainQuery->have_posts()) {
        $mainQuery->the_post();

        if (get_post_type() == 'post' or get_post_type() == 'page') {
            array_push($results['generalInfo'], array(
                'title' => get_the_title(),
                'permalink' => get_the_permalink(),
                'postType' => get_post_type(),
                'authorName' => get_the_author()
            ));
        }

        if (get_post_type() == 'professor') {
            $relatedPrograms = get_field('related_programs');

            if ($relatedPrograms) {
                foreach($relatedPrograms as $program) {
                    array_push($results['programs'], array(
                        'title' => get_the_title($program),
                        'permalink' => get_the_permalink($program)
                    ));
                }
            }

            // Delete any duplicate result that can occur when the related search result contains the same search keyword
            $results['programs'] = array_values(array_unique($results['programs'], SORT_REGULAR));

            array_push($results['professors'], array(
                'title' => get_the_title(),
                'permalink' => get_the_permalink(),
                'image' => get_the_post_thumbnail_url(0, 'professorLandscape')
            ));
        }

        if (get_post_type() == 'program') {
            $relatedCampuses = get_field('related_campuses');

            if ($relatedCampuses) {
                foreach($relatedCampuses as $campus) {
                    array_push($results['campuses'], array(
                        'title' => get_the_title($campus),
                        'permalink' => get_the_permalink($campus)
                    ));
                }

            }

            array_push($results['programs'], array(
                'title' => get_the_title(),
                'permalink' => get_the_permalink(),
                'id' => get_the_ID()
            ));

        }

        if (get_post_type() == 'event') {
            $relatedPrograms = get_field('related_programs');

            if ($relatedPrograms) {
                foreach($relatedPrograms as $program) {
                    array_push($results['programs'], array(
                        'title' => get_the_title($program),
                        'permalink' => get_the_permalink($program)
                    ));
                }
            }

            // Delete any duplicate result that can occur when the related search result contains the same search keyword
            $results['programs'] = array_values(array_unique($results['programs'], SORT_REGULAR));

            $eventDate = new DateTime(get_field('event_date'));
            $description = wp_trim_words(get_the_excerpt(), 18);
            array_push($results['events'], array(
                'title' => get_the_title(),
                'permalink' => get_the_permalink(),
                'month' => $eventDate->format('M'),
                'day' => $eventDate->format('d'),
                'description' => $description
            ));
        }

        if (get_post_type() == 'campus') {
            array_push($results['campuses'], array(
                'title' => get_the_title(),
                'permalink' => get_the_permalink()
            ));

            // Delete any duplicate result that can occur when the related search result contains the same search keyword
            $results['campuses'] = array_values(array_unique($results['campuses'], SORT_REGULAR));
        }

    }

    // When program(s) is(are) included as part of keyword search results,
    // populate $results['professors'] with professor(s) assoicated with each program.
    if ($results['programs']) {
        $programsMetaQuery = array('relation' => 'OR');

        // Get program id(s) that resulted from keyword search
        foreach($results['programs'] as $program) {
            array_push($programsMetaQuery, array(
                'key' => 'related_programs',
                'compare' => 'LIKE',
                'value' => '"' . $program['id'] . '"'
            ));
        }

        // Get professor(s) related to the program(s)
        $programRelationshipQuery = new WP_Query(array(
            'post_type' => array('professor', 'event'),
            'meta_query' => $programsMetaQuery
            )
        );

        // Populate $results['professors] data by looping through
        while($programRelationshipQuery->have_posts()) {
            $programRelationshipQuery->the_post();

            if (get_post_type() == 'professor') {
                array_push($results['professors'], array(
                    'title' => get_the_title(),
                    'permalink' => get_the_permalink(),
                    'image' => get_the_post_thumbnail_url(0, 'professorLandscape')
                ));
            }

            if (get_post_type() == 'event') {
                $eventDate = new DateTime(get_field('event_date'));
                $description = wp_trim_words(get_the_excerpt(), 18);
                array_push($results['events'], array(
                    'title' => get_the_title(),
                    'permalink' => get_the_permalink(),
                    'month' => $eventDate->format('M'),
                    'day' => $eventDate->format('d'),
                    'description' => $description
                ));
            }
        }

        // Delete any duplicate result that can occur when the related search result contains the same search keyword
        $results['professors'] = array_values(array_unique($results['professors'], SORT_REGULAR));
        $results['events'] = array_values(array_unique($results['events'], SORT_REGULAR));
    }

    return $results;
}

add_action('rest_api_init', 'university_register_search');