<?php
    get_header();

    while(have_posts()) {
        the_post();
        pageBanner();
        ?>


    <div class="container container--narrow page-section">
        <?php
            // If the current page has a parent, $theParent will be a parent id.
            // Otherwise, it will be zero(false).
            $theParent = wp_get_post_parent_id(get_the_ID());

            // Show breadcrumb for children pages only
            if ($theParent) { ?>
                <div class="metabox metabox--position-up metabox--with-home-link">
                    <p>
                    <a class="metabox__blog-home-link" href="<?php echo get_permalink($theParent); ?>"><i class="fa fa-home" aria-hidden="true"></i> Back to <?php echo get_the_title($theParent); ?></a> <span class="metabox__main"><?php the_title(); ?></span>
                    </p>
                </div>
            <?php }
        ?>


    <?php
    $hasChild = get_pages(array(
        'child_of' => get_the_ID()
    ));

    // Show page links for any pages with parent-child relationship only.
    if ($theParent or $hasChild) { ?>
      <div class="page-links">
        <h2 class="page-links__title">
            <a href="<?php echo get_permalink($theParent); ?>">
                <?php echo get_the_title($theParent); ?>
            </a>
        </h2>
        <ul class="min-list">
            <?php
                if ($theParent) { // if the current page is a child
                    $findChildrenOf = $theParent;
                } else { // if the current page is a parent
                    $findChildrenOf = get_the_ID();
                }

                wp_list_pages(array(
                    'title_li' => NULL,
                    'child_of' => $findChildrenOf,
                    'sort_column' => 'menu_order'
                ));
            ?>
        </ul>
      </div>
    <?php } ?>

      <div class="generic-content">
          <?php get_search_form(); ?>
      </div>
    </div>

   <?php }

   get_footer();
?>
