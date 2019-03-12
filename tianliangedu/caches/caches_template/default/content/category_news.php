<?php defined('IN_PHPCMS') or exit('No permission resources.'); ?><?php include template("content","header"); ?>
<div id="news" style="display: block;">
    <div class="news-box row clearfix">
        <div class="news-recent fl">
            <div class="recent-inner">
                <h2 class="recent-title">最新资讯</h2>
                <div class="recent-info clearfix">
                    <div class="recent-slide">
                        <div class="slide-scroll">
                            <div class="slide-wrap">
                                <ul class="slide-scroll-list">
                                    <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"content\" data=\"op=content&tag_md5=6b2e484dcba0404b31a65add3f8acd30&action=position&posid=1&order=listorder+DESC&num=4\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">修改</a>";}$content_tag = pc_base::load_app_class("content_tag", "content");if (method_exists($content_tag, 'position')) {$data = $content_tag->position(array('posid'=>'1','order'=>'listorder DESC','limit'=>'4',));}?>
                                        <?php $i =0;?>
                                          <?php $n=1; if(is_array($data)) foreach($data AS $key => $val) { ?>
                                        <?php $i ++?>
                                        <li class="item  <?php if($i == 1) { ?>cur<?php } ?>">
                                          <div class="item-info"><a target="_blank" title="<?php echo $val['title'];?>" href="<?php echo $val['url'];?>"><img alt="<?php echo $val['title'];?>" src="<?php echo $val['thumb'];?>" class="scroll-img"></a><p class="item-bg"></p><p class="item-title"><a target="_blank" href="<?php echo $val['url'];?>"><?php echo $val['title'];?></a></p></div>
                                        </li>
                                       <?php $n++;}unset($n); ?>
                                     <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
                                </ul>
                                <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"content\" data=\"op=content&tag_md5=6b2e484dcba0404b31a65add3f8acd30&action=position&posid=1&order=listorder+DESC&num=4\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">修改</a>";}$content_tag = pc_base::load_app_class("content_tag", "content");if (method_exists($content_tag, 'position')) {$data = $content_tag->position(array('posid'=>'1','order'=>'listorder DESC','limit'=>'4',));}?>
                                    <ol>
                                        <?php $i =0;?>
                                          <?php $n=1; if(is_array($data)) foreach($data AS $key => $val) { ?>
                                        <?php $i ++?>
                                          <li class="<?php if($i == 1) { ?>cur<?php } ?>"><?php echo $i;?></li>
                                        <?php $n++;}unset($n); ?>
                                    </ol>
                                    <a href="javascript:;" class="slide-btn pre-btn"></a>
                                    <a href="javascript:;" class="slide-btn next-btn"></a>
                                <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
                            </div>
                        </div>
                    </div>
                    <div class="recent-content">
                    <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"content\" data=\"op=content&tag_md5=c8c315ed88946ded4505dc27a94e1f9d&action=position&posid=2&order=listorder+DESC&num=1\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">修改</a>";}$content_tag = pc_base::load_app_class("content_tag", "content");if (method_exists($content_tag, 'position')) {$data = $content_tag->position(array('posid'=>'2','order'=>'listorder DESC','limit'=>'1',));}?>
                        <?php $i =0;?>
                            <?php $n=1; if(is_array($data)) foreach($data AS $key => $val) { ?>
                        <?php $i ++?>
                            <div class="content-title">
                                <div class="content-hd">
                                    <a title="<?php echo $val['title'];?>" href="<?php echo $val['url'];?>"><?php echo $val['title'];?></a></div>
                                <div class="content-bd">&nbsp;&nbsp;<?php echo $val['description'];?><a href="<?php echo $val['url'];?>">【查看详情】</a></div>
                            </div>
                        <?php $n++;}unset($n); ?>
                    <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
                    <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"content\" data=\"op=content&tag_md5=87abde2a14600a5f1af76fe9899d8efb&action=position&posid=2&order=id+DESC+LIMIT+1%2C5--&num=5\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">修改</a>";}$content_tag = pc_base::load_app_class("content_tag", "content");if (method_exists($content_tag, 'position')) {$data = $content_tag->position(array('posid'=>'2','order'=>'id DESC LIMIT 1,5--','limit'=>'5',));}?>
                        <ul class="content-list">
                        <?php $n=1; if(is_array($data)) foreach($data AS $key => $val) { ?>
                            <li><a title="<?php echo $val['title'];?>" href="<?php echo $val['url'];?>"><?php echo $val['title'];?></a></li>
                        <?php $n++;}unset($n); ?>
                        </ul>
                    <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
                    </div>
                </div>
            </div>
            <div class="recent-inner-por">
                <div class="por-head clearfix">
                    <?php $j=1;?>
                    <?php $n=1;if(is_array(subcat($catid))) foreach(subcat($catid) AS $v) { ?>
                        <?php if($v['type']!=0) continue;?>
                            <a class="<?php if($j == 1) { ?>cur<?php } ?>" href="javascript:;" title="<?php echo $v['catname'];?>"><?php echo $v['catname'];?></a>
                        <?php $j++; ?>
                    <?php $n++;}unset($n); ?>
                </div>
                <div class="por-body">
                    <?php $j=1;?>
                    <?php $n=1;if(is_array(subcat($catid))) foreach(subcat($catid) AS $v) { ?>
                        <?php if($v['type']!=0) continue;?>
                        <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"content\" data=\"op=content&tag_md5=5d107604b68e61f01796643989da0a78&action=lists&catid=%24v%5Bcatid%5D&num=5&order=id+DESC\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">修改</a>";}$content_tag = pc_base::load_app_class("content_tag", "content");if (method_exists($content_tag, 'lists')) {$data = $content_tag->lists(array('catid'=>$v[catid],'order'=>'id DESC','limit'=>'5',));}?>
                            <ul class="por-list <?php if($j == 1) { ?>cur<?php } ?>">
                                <?php $n=1;if(is_array($data)) foreach($data AS $v) { ?>
                                    <li><a href="<?php echo $v['url'];?>" title="<?php echo $v['title'];?>"><p class="text-overflow"><?php echo $v['title'];?></p><em><?php echo str_cut(date('Y-m-d',$v[inputtime]),12,$dot='');?></em></a></li>
                                <?php $n++;}unset($n); ?>
                            </ul>
                         <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
                         <?php $j++; ?>
                    <?php $n++;}unset($n); ?>
                </div>
            </div>
        </div>
        <div class="news-push fr">
            <div class="push-outer">
                <h2 class="push-title"><a href="javascript:;" target="_blank" style="color:#333">教学动态</a></h2>
                <div class="push-info">
                    <div class="push-wrap" style="overflow:hidden; position:relative; width:326px">
                        <div class="push-inner">
                            <ul class="push-inner-list" style="float: left; width: 326px;">
                                <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"content\" data=\"op=content&tag_md5=99249c862ed1dce5a86eb3bee96dfcce&action=lists&catid=21&order=listorder+DESC&num=5\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">修改</a>";}$content_tag = pc_base::load_app_class("content_tag", "content");if (method_exists($content_tag, 'lists')) {$data = $content_tag->lists(array('catid'=>'21','order'=>'listorder DESC','limit'=>'5',));}?>
                                    <?php $n=1; if(is_array($data)) foreach($data AS $key => $val) { ?>
                                        <li>
                                            <a href="<?php echo $val['url'];?>" title="<?php echo $val['title'];?>"><?php echo $val['title'];?></a>
                                        </li>
                                    <?php $n++;}unset($n); ?>
                                <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="push-contro hide">
                    <span class="prev">&lt;</span>
                    <ul class="contro-list"><span class="on"></span><span class=""></span><span class=""></span></ul>
                    <span class="next">&gt;</span>
                </div>
            </div>
            <div class="push-outer">
                <h2 class="push-title"><a href="javascript:;" target="_blank" style="color:#333">最新公告</a></h2>
                <div class="push-info">
                    <div class="push-wrap" style="overflow:hidden; position:relative; width:326px">
                        <div class="push-inner">
                            <ul class="push-inner-list" style="float: left; width: 326px;">
                                <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"content\" data=\"op=content&tag_md5=26dbd3c1bc4331e11fc9d3d5a5319a29&action=lists&catid=20&order=listorder+DESC&num=6\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">修改</a>";}$content_tag = pc_base::load_app_class("content_tag", "content");if (method_exists($content_tag, 'lists')) {$data = $content_tag->lists(array('catid'=>'20','order'=>'listorder DESC','limit'=>'6',));}?>
                                    <?php $i =0;?>
                                        <?php $n=1; if(is_array($data)) foreach($data AS $key => $val) { ?>
                                    <?php $i ++?>
                                        <li>
                                            <a href="<?php echo $val['url'];?>" title="<?php echo $val['title'];?>"><?php echo $val['title'];?></a>
                                        </li>
                                    <?php $n++;}unset($n); ?>
                                <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="push-contro hide">
                    <span class="prev">&lt;</span>
                    <ul class="contro-list"><span class="on"></span><span class=""></span><span class=""></span></ul>
                    <span class="next">&gt;</span>
                </div>
            </div>
            <div class="push-ads">
                <a href="/" target="_blank" title="我是广告位置"><img src="<?php echo APP_PATH;?>dist/page/news/0.0.1/images/ad.jpg" width="350px" height="200px"></a>
            </div>
        </div>
    </div>
</div>
<script src="<?php echo APP_PATH;?>framework/src/require.js" data-main="<?php echo APP_PATH;?>dev/page/news/news.js"></script>
<?php include template("content","footer"); ?>