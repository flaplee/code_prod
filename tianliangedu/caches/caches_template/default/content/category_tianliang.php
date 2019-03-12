<?php defined('IN_PHPCMS') or exit('No permission resources.'); ?><?php include template("content","header"); ?>
<div id="booking" style="display:block;">
    <div class="booking-box row clearfix">
        <div class="booking-title clearfix">
            <a class="booking-title-text" href="/"></a>
            <div class="booking-title-list clearfix">
                <div class="booking-nav booking-nav-first"><span class="icon-step ">培优计划</span></div>
                <div class="booking-nav"><span class="icon-step icon-step-cur">培优课程</span></div>
                <div class="booking-nav"><span class="icon-step">培优实战</span></div>
                <div class="booking-nav"><span class="icon-step icon-step-cur">培优反馈</span></div>
            </div>
        </div>
        <div class="booking-main fl">
            <div class="booking-main-inner">
                <div class="inner-nav clearfix">
                    <?php $j=1;?>
                    <?php $n=1;if(is_array(subcat($catid))) foreach(subcat($catid) AS $v) { ?>
                        <?php if($v['type']!=0) continue;?>
                            <div class="inner-nav-item <?php if($j == 1) { ?>cur<?php } ?>">
                                <a href="javascript:;" title="<?php echo $v['catname'];?>"><?php echo $v['catname'];?></a>
                            </div>
                        <?php $j++; ?>
                    <?php $n++;}unset($n); ?>
                </div>
                <div class="inner-tip clearfix">
                    为你找到<strong>8</strong>课程
                    <span class="inner-tip-con fr hide">培优提示:</span>
                    <span class="inner-tip-tips fr">天亮培优值得托付</span>
                </div>
                <div class="course-detail">
                    <?php $j=1;?>
                    <?php $n=1;if(is_array(subcat($catid))) foreach(subcat($catid) AS $v) { ?>
                        <?php if($v['type']!=0) continue;?>
                        <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"content\" data=\"op=content&tag_md5=667bdda2110075d333d88e134029a615&action=lists&catid=%24v%5Bcatid%5D&num=5&order=id+DESC&moreinfo=1\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">编辑</a>";}$content_tag = pc_base::load_app_class("content_tag", "content");if (method_exists($content_tag, 'lists')) {$data = $content_tag->lists(array('catid'=>$v[catid],'order'=>'id DESC','moreinfo'=>'1','limit'=>'5',));}?>
                            <div class="course-list">
                                <?php $n=1;if(is_array($data)) foreach($data AS $v) { ?>
                                <a href="<?php echo $v['url'];?>" target="_blank">
                                    <div class="img fl">
                                        <div class="img_inside">
                                            <img src="<?php echo $v['courseimg'];?>" title="<?php echo $v['title'];?>" alt="<?php echo $v['title'];?>">
                                        </div>
                                    </div>
                                    <div class="fl course-inner">
                                        <h3 class="font_size20"><?php echo $v['title'];?></h3>
                                        <ul class="font_size14 fl">
                                            <li><?php echo str_cut($v[features], 80, '...');?></li>
                                            <li><?php echo str_cut($v[featuress], 80, '...');?></li>
                                            <li><?php echo str_cut($v[featuresss], 80, '...');?></li>
                                        </ul>
                                        <div class="speaker fl">
                                            <div class="fl">
                                                <img src="<?php echo $v['thumb'];?>" title="<?php echo $v['course'];?>" alt="<?php echo $v['course'];?>">
                                            </div>
                                            <div class="information font_size14 fl">
                                                <?php if($v[subject] == '') { ?>
                                                    <p>课程概况：</p>
                                                    <p><?php echo $v['abstract'];?></p>
                                                <?php } else { ?>
                                                    <p>适合对象：</p>
                                                    <p><?php echo $v['subject'];?></p>
                                                <?php } ?>
                                                <p class="text font_size12 font_color_gray"><?php echo $v['description'];?></p>
                                                <p class="font_color_black">课程地点：<?php echo $v['address'];?></p>
                                            </div>
                                            <div class="join font_size12 font_color_gray fr">
                                                <p class="font_size14 font_color_black">课程内容：</p>
                                                <p><em class="font_size24 font_color_black"><?php echo str_cut($v[course], 16, '...');?></em></p>
                                                <button>了解详情</button>
                                                <p>免费咨询</p>
                                                <p>027-81771511</p>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                                <?php $n++;}unset($n); ?>
                            </div>
                         <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
                         <?php $j++; ?>
                    <?php $n++;}unset($n); ?>
                    <div id="pages" class="text-c"></div>
                </div>
            </div>
        </div>
        <div class="booking-side fr">
            <div class="side-entry clearfix">
                <div class="entry-shadow"></div>
                <div class="entry-title clearfix">
                    <h3 class="entry-inner">天亮社区</h3>
                </div>
                <div class="entry-info">
                    <div class="entry-content">
                        <div class="content-box content-pros">
                            <div class="content-box-wrap">
                                <div class="wrap-scroll wrap-light wrap-vertical wrap-inside">
                                    <div class="wrap-container">
                                        <div class="wrap-list">
                                            <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"content\" data=\"op=content&tag_md5=ed71a03f817303a6a372504cfad9a4e6&action=category&catid=13&num=6&siteid=%24siteid&order=listorder+ASC\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">编辑</a>";}$content_tag = pc_base::load_app_class("content_tag", "content");if (method_exists($content_tag, 'category')) {$data = $content_tag->category(array('catid'=>'13','siteid'=>$siteid,'order'=>'listorder ASC','limit'=>'6',));}?>
                                                <?php $n=1;if(is_array($data)) foreach($data AS $r) { ?>
                                                    <div class="wrap-item wrap-item-flights">
                                                        <div class="wrap-item-header">
                                                            <span><em><?php echo $r['catname'];?></em><i></i></span>
                                                            <a href="<?php echo $r['url'];?>" class="wrap-item-btn">查看</a>
                                                        </div>
                                                    </div>
                                                <?php $n++;}unset($n); ?>
                                            <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
                                            <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"get\" data=\"op=get&tag_md5=24f62ab2df41417cb79c821b922b65cc&sql=select+%2A+from+phpcms_category+where+catid+in%2816%2C17%2C18%2C19%2C20%2C21%29&return=data\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">编辑</a>";}pc_base::load_sys_class("get_model", "model", 0);$get_db = new get_model();$r = $get_db->sql_query("select * from phpcms_category where catid in(16,17,18,19,20,21) LIMIT 20");while(($s = $get_db->fetch_next()) != false) {$a[] = $s;}$data = $a;unset($a);?> 
                                                <?php $n=1;if(is_array($data)) foreach($data AS $r) { ?> 
                                                    <div class="wrap-item wrap-item-flights">
                                                        <div class="wrap-item-header">
                                                            <span><em><?php echo $r['catname'];?></em><i></i></span>
                                                            <a href="<?php echo $r['url'];?>" class="wrap-item-btn">查看</a>
                                                        </div>
                                                    </div>
                                                <?php $n++;}unset($n); ?>
                                            <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="<?php echo APP_PATH;?>framework/src/require.js" data-main="<?php echo APP_PATH;?>dev/page/booking/booking.js"></script>
<?php include template("content","footer"); ?>