<div class="post-item">
    <!-- Title -->
    <h2 class="headline headline--medium headline--post-title">
        <a href="<?php the_permalink(); ?>">
        <?php the_title(); ?>
        </a>
    </h2>
    <!-- Excerpt & Continue Reading Button -->
    <div class="generic-content">
        <?php the_excerpt(); ?>
        <p>
            <a class="btn btn--blue" href="<?php the_permalink(); ?>">
            View campus &raquo;
            </a>
        </p>
    </div>
</div>