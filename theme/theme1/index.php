<?php
/**
 * Theme Index - Loads all theme CSS files
 * This file is included in the main index.php to load all theme styles
 */

$themeRoot = rtrim(str_replace('\\', '/', $basePath ?? ''), '/') . '/theme/' . ($settings['active_theme'] ?? 'theme1');
?>


<?php
// Get primary and secondary colors from settings
$primaryColor = $settings['primary_color'] ?? '#fa360a';
$secondaryColor = $settings['secondary_color'] ?? '#000000';

// Function to lighten color for variants
function lightenColor($hex, $percent)
{
    $hex = ltrim($hex, '#');
    $r = hexdec(substr($hex, 0, 2));
    $g = hexdec(substr($hex, 2, 2));
    $b = hexdec(substr($hex, 4, 2));

    $r = min(255, $r + (255 - $r) * $percent / 100);
    $g = min(255, $g + (255 - $g) * $percent / 100);
    $b = min(255, $b + (255 - $b) * $percent / 100);

    return sprintf("#%02x%02x%02x", $r, $g, $b);
}

// Generate color variants
$primaryColor2 = lightenColor($primaryColor, 20);
$primaryColor3 = lightenColor($primaryColor, 40);
$primaryColor4 = lightenColor($primaryColor, 60);

$secondaryColor2 = lightenColor($secondaryColor, 20);
$secondaryColor3 = lightenColor($secondaryColor, 40);
$secondaryColor4 = lightenColor($secondaryColor, 60);
?>

<style type="text/css">
    :root {
        --color-primary:
            <?php echo $primaryColor; ?>
        ;
        --color-primary2:
            <?php echo $primaryColor2; ?>
        ;
        --color-primary3:
            <?php echo $primaryColor3; ?>
        ;
        --color-primary4:
            <?php echo $primaryColor4; ?>
        ;

        --color-secondary:
            <?php echo $secondaryColor; ?>
        ;
        --color-secondary2:
            <?php echo $secondaryColor2; ?>
        ;
        --color-secondary3:
            <?php echo $secondaryColor3; ?>
        ;
        --color-secondary4:
            <?php echo $secondaryColor4; ?>
        ;

        --color-default: #000000;
        --color-default2: #424242;
        --color-default3: #9d9d9d;
        --color-default4: #efefef;

        --color-overlay: rgba(0, 0, 0, 0.4);

        --color-white: #fff;
        --color-black: #000;
        --rgb--primary:
            <?php
            $hex = ltrim($primaryColor, '#');
            $r = hexdec(substr($hex, 0, 2));
            $g = hexdec(substr($hex, 2, 2));
            $b = hexdec(substr($hex, 4, 2));
            echo "$r, $g, $b";
            ?>
        ;
        --color-gray: rgb(156, 155, 155);
        --color-primary--rgb:
            <?php
            $hex = ltrim($primaryColor, '#');
            $r = hexdec(substr($hex, 0, 2));
            $g = hexdec(substr($hex, 2, 2));
            $b = hexdec(substr($hex, 4, 2));
            echo "$r, $g, $b";
            ?>
        ;
        --h1-font-family: inherit;
        --h2-font-family: inherit;
        --h3-font-family: inherit;
        --h4-font-family: inherit;
        --h5-font-family: inherit;
        --h6-font-family: inherit;
        --menu-font-family: "Barlow", sans-serif;
        --title-font-family: "Barlow", sans-serif;
        --body-font-family: "Roboto", sans-serif;
        --btn-font-family: "Barlow", sans-serif;
        --subtitle-font-family: "Roboto", sans-serif;
        --plain-text-font-family: inherit;
        --blue: #007bff;
        --indigo: #6610f2;
        --purple: #6f42c1;
        --pink: #e83e8c;
        --red: #dc3545;
        --orange: #fd7e14;
        --yellow: #ffc107;
        --green: #28a745;
        --teal: #20c997;
        --cyan: #17a2b8;
        --white: #fff;
        --gray: #6c757d;
        --gray-dark: #343a40;
        --primary: #007bff;
        --secondary: #6c757d;
        --success: #28a745;
        --info: #17a2b8;
        --warning: #ffc107;
        --danger: #dc3545;
        --light: #f8f9fa;
        --dark: #343a40;
        --p-color: #646464;
        --title-color: #1f1f1f;
        --input-color: #727679;
        --gradient-color: linear-gradient(180deg,
                var(--color-primary) 0%,
                var(--color-secondary) 100%);
    }
</style>

<!-- Theme CSS Files -->
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/bootstrap.min.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/aos.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/glightbox.min.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/select2.min.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/slick.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/slick-theme.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/swiper.min.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/jsocial.css">

<!-- Layout Styles -->
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/topbar.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/header.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/menu.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/footer.css">

<!-- Component Styles -->
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/buttons.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/title.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/subtitle.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/newsletter.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/clients.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/teams.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/testimonial.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/services.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/price-table.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/faq.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/contact.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/about.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/experience.css">

<!-- Gallery & Media -->
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/gallery.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/tab-gallery.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/recent-work.css">

<!-- Slider Styles -->
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/slider.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/slider-navigation.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/slider-pagination.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/slider-social.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/slide.css">

<!-- Animation Styles -->
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/aos-text-animation.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/onlyanimation.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/image-hover-animation.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/single-img-animation.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/loop-hover-img-animation.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/unique-animations-nav.css">

<!-- Blog & Content -->
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/blog.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/single-blog.css">

<!-- E-commerce -->
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/products.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/single-product.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/cart.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/checkout.css">

<!-- Timeline -->
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/timeline.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/timeline-2.css">

<!-- Utility Styles -->
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/image-screen.css">
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/j-arrow-font.css">

<!-- Main Theme Style -->
<link rel="stylesheet" href="<?php echo $themeRoot; ?>/css/style.css">