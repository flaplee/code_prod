<?php defined('IN_PHPCMS') or exit('No permission resources.'); ?><?php include template("content","header"); ?>
<style>
.course-detail .course-list>a:hover {
    color: #323232;
    box-shadow: 0px 0px 10px 0px #ddd;
    margin-top: -1px;
    margin-bottom: 21px
}

</style>
<div id="list" style="display:block;">
    <div class="course-box clearfix">
        <div class="course-nav">
            <ul class="course-inner">
                <li class="item"><h4>理科辅导</h4><span>小学数学</span><span>初中理科</span><span>高中理科</span></li>
                <li class="item"><h4>文科辅导</h4><span>小学语文</span><span>高中文科</span><span>初中文科</span></li>
                <li class="item"><h4>兴趣爱好</h4><span>科技艺术</span><span>艺术体育</span><span>托管班</span><span>夏冬令营</span></li>
            </ul>
            <div class="course-relate">
                <p class="title">天亮咨询热线</p>
                <div class="info">
                    <i class="iconfont">&#xe629;</i>
                    <div class="text">027-81771511</div>
                </div>
                <div class="line"></div>
                <a class="inner" href="javascript:;">
                    <p>不知道该如何选择？</p>
                    <p><span>让咨询顾问主动联系你吧！</span></p>
                </a>
            </div>
        </div>
        <div class="course-cont">
            <div class="course-crumb">
                当前位置：<a href="<?php echo siteurl($siteid);?>">首页</a><span>&gt;</span><?php echo catpos($catid);?><span class="sup-title">列表</span>
            </div>
            <div class="course-detail">
                <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"content\" data=\"op=content&tag_md5=5ab4b05e97fd14c3ed386604ee1a9399&action=lists&catid=%24catid&num=25&order=id+DESC&page=%24page\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">修改</a>";}$content_tag = pc_base::load_app_class("content_tag", "content");if (method_exists($content_tag, 'lists')) {$pagesize = 25;$page = intval($page) ? intval($page) : 1;if($page<=0){$page=1;}$offset = ($page - 1) * $pagesize;$content_total = $content_tag->count(array('catid'=>$catid,'order'=>'id DESC','limit'=>$offset.",".$pagesize,'action'=>'lists',));$pages = pages($content_total, $page, $pagesize, $urlrule);$data = $content_tag->lists(array('catid'=>$catid,'order'=>'id DESC','limit'=>$offset.",".$pagesize,'action'=>'lists',));}?>
                    <ul class="course-list">
                        <?php $n=1;if(is_array($data)) foreach($data AS $r) { ?>
                            <li class="item clearfix">
                                <a class="item-img" href="<?php echo $r['url'];?>" target="_blank" title="" style="width:170px;height:100px;background:url('<?php echo $r['thumb'];?>') no-repeat center;background-size: 100%;"></a>
                                <div class="item-info">
                                    <strong>【<?php echo $CATEGORYS[$catid]['catname'];?>动态】</strong>
                                    <a class="item-title" href="<?php echo $r['url'];?>" target="_blank" title="<?php echo $r['title'];?>"><?php echo $r['title'];?></a>
                                    <span class="rt"><?php echo date('Y-m-d H:i:s',$r[inputtime]);?></span>
                                    <p class="item-desc"><?php echo $r['description'];?><a class="item-detail" href="<?php echo $r['url'];?>" target="_blank" title="<?php echo $r['description'];?>">【详细】</a>
                                    </p>
                                    <p style="display:none;"><?php echo date('Y-m-d',$r[inputtime]);?></p>
                                </div>
                            </li>
                        <?php $n++;}unset($n); ?>
                    </ul>
                    <div id="pages" class="text-c"><?php echo $pages;?></div>
                <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
            </div>
        </div>
    </div>
</div>
<!--main-->
<div class="main" style="display:none;">
	<div class="col-left">
    	<div class="crumbs"><a href="<?php echo siteurl($siteid);?>">首页</a><span> > </span><?php echo catpos($catid);?> 列表</div>
    	<?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"content\" data=\"op=content&tag_md5=5ab4b05e97fd14c3ed386604ee1a9399&action=lists&catid=%24catid&num=25&order=id+DESC&page=%24page\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">修改</a>";}$content_tag = pc_base::load_app_class("content_tag", "content");if (method_exists($content_tag, 'lists')) {$pagesize = 25;$page = intval($page) ? intval($page) : 1;if($page<=0){$page=1;}$offset = ($page - 1) * $pagesize;$content_total = $content_tag->count(array('catid'=>$catid,'order'=>'id DESC','limit'=>$offset.",".$pagesize,'action'=>'lists',));$pages = pages($content_total, $page, $pagesize, $urlrule);$data = $content_tag->lists(array('catid'=>$catid,'order'=>'id DESC','limit'=>$offset.",".$pagesize,'action'=>'lists',));}?>
        <ul class="list lh24 f14">
<?php $n=1;if(is_array($data)) foreach($data AS $r) { ?>
	<li><span class="rt"><?php echo date('Y-m-d H:i:s',$r[inputtime]);?></span>·<a href="<?php echo $r['url'];?>" target="_blank"<?php echo title_style($r[style]);?>><?php echo $r['title'];?></a></li>
	<?php if($n%5==0) { ?><li class="bk20 hr"></li><?php } ?>
<?php $n++;}unset($n); ?>
        </ul>
        <div id="pages" class="text-c"><?php echo $pages;?></div>
<?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
  </div>
    <div class="col-auto">
        <div class="box">
            <h5 class="title-2">频道总排行</h5>
             <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"content\" data=\"op=content&tag_md5=0ad40a45ad075d8f47798a231e25aec2&action=hits&catid=%24catid&num=10&order=views+DESC&cache=3600\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">修改</a>";}$tag_cache_name = md5(implode('&',array('catid'=>$catid,'order'=>'views DESC',)).'0ad40a45ad075d8f47798a231e25aec2');if(!$data = tpl_cache($tag_cache_name,3600)){$content_tag = pc_base::load_app_class("content_tag", "content");if (method_exists($content_tag, 'hits')) {$data = $content_tag->hits(array('catid'=>$catid,'order'=>'views DESC','limit'=>'10',));}if(!empty($data)){setcache($tag_cache_name, $data, 'tpl_data');}}?>
            <ul class="content digg">
				<?php $n=1;if(is_array($data)) foreach($data AS $r) { ?>
					<li><a href="<?php echo $r['url'];?>" target="_blank"><?php echo $r['title'];?></a></li>
				<?php $n++;}unset($n); ?>
            </ul>
            <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
        </div>
        <div class="bk10"></div>
        <div class="box">
            <h5 class="title-2">频道本月排行</h5>
             <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"content\" data=\"op=content&tag_md5=2caa10e576ba663010144233732308cd&action=hits&catid=%24catid&num=8&order=monthviews+DESC&cache=3600\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">修改</a>";}$tag_cache_name = md5(implode('&',array('catid'=>$catid,'order'=>'monthviews DESC',)).'2caa10e576ba663010144233732308cd');if(!$data = tpl_cache($tag_cache_name,3600)){$content_tag = pc_base::load_app_class("content_tag", "content");if (method_exists($content_tag, 'hits')) {$data = $content_tag->hits(array('catid'=>$catid,'order'=>'monthviews DESC','limit'=>'8',));}if(!empty($data)){setcache($tag_cache_name, $data, 'tpl_data');}}?>
            <ul class="content rank">
				<?php $n=1;if(is_array($data)) foreach($data AS $r) { ?>
				<li><span><?php echo number_format($r[monthviews]);?></span><a href="<?php echo $r['url'];?>"<?php echo title_style($r[style]);?> class="title" title="<?php echo $r['title'];?>"><?php echo str_cut($r[title],56,'...');?></a></li>
				<?php $n++;}unset($n); ?>
            </ul>
            <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
        </div>
    </div>
</div>
<script src="<?php echo APP_PATH;?>framework/src/require.js" data-main="<?php echo APP_PATH;?>dev/page/list/list.js"></script>
<?php include template("content","footer"); ?>