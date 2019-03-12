<?php defined('IN_PHPCMS') or exit('No permission resources.'); ?><?php include template("content","header"); ?>
<div id="about" style="display:block;">
    <div class="about-box row clearfix">
        <?php include template("content","left_about"); ?>
        <div class="about-content fr">
            <section>
                <h3><?php echo $title;?></h3>
                <?php echo $content;?>
            </section>
        </div>
    </div>
</div>
<script src="<?php echo APP_PATH;?>framework/src/require.js" data-main="<?php echo APP_PATH;?>dev/page/about/about.js"></script>
<?php include template("content","footer"); ?>