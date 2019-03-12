<?php defined('IN_PHPCMS') or exit('No permission resources.'); ?><?php include template("content","header"); ?>
<div id="service" style="display:block;">
	<div class="service-box clearfix">
		<div class="service-nav">
			<ul class="course-inner">
                <li class="item"><h4>理科辅导</h4><span>小学数学</span><span>初中理科</span><span>高中理科</span></li>
                <li class="item"><h4>文科辅导</h4><span>小学语文</span><span>高中理科</span><span>初中文科</span></li>
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
		<div class="service-cont">
			<div class="service-crumb">
				当前位置：<a href="<?php echo siteurl($siteid);?>">首页</a><span> &gt; </span><?php echo catpos($catid);?><span class="sup-title">正文</span>
			</div>
			<div class="service-detail details">
				<div class="left">
					<div class="tags clearfix">
						<?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"block\" data=\"op=block&tag_md5=d93d75330a8cc5a407942ce7e0e4ff38&pos=tianliang_tags\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">添加碎片</a>";}$block_tag = pc_base::load_app_class('block_tag', 'block');echo $block_tag->pc_tag(array('pos'=>'tianliang_tags',));?><?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
					</div>
					<div class="head">
						<h3><?php echo $title;?></h3>
						<p class="font_size12 font_color_gray mt10 mb20 textright">发布日期：<?php echo str_cut($inputtime,15,$dot='');?>来源：<span class="blue">天亮教育</span></p>
					</div>
					<div class="description">
						<p>摘要：<?php if($description) { ?><div class="summary" ><?php echo $description;?></div><?php } ?></p>
					</div>
					<div class="text">
						<?php if($allow_visitor==1) { ?>
							<?php echo $content;?>
							<!--内容关联投票-->
							<?php if($voteid) { ?><script language="javascript" src="<?php echo APP_PATH;?>index.php?m=vote&c=index&a=show&action=js&subjectid=<?php echo $voteid;?>&type=2"></script><?php } ?>
			                
						<?php } else { ?>
							<CENTER><a href="<?php echo APP_PATH;?>index.php?m=content&c=readpoint&allow_visitor=<?php echo $allow_visitor;?>"><font color="red">阅读此信息需要您支付 <B><I><?php echo $readpoint;?> <?php if($paytype) { ?>元<?php } else { ?>点<?php } ?></I></B>，点击这里支付</font></a></CENTER>
						<?php } ?>
					</div>
					<div class="copyright">
						<p class="mb10">版权声明：</p>
						<div>
							<p>
								本文章仅用于学习和交流目的，非商业转载请注明文章来源。对未经许可擅自使用者，本公司保留追究其法律责任的权利。如需转载或商业合作，请联系武汉天亮培优学校<span>tanliangedu@163.com</span>
							</p>
							<p>来源：<span><?php echo $copyfrom;?></span></p>
						</div>
					</div>
					<div class="like_share" style="display:none;">
						<div class="like"><p class="text">评论</p><p id="praise"><a href="#comment_iframe" id="comment">0</a></p><p class="addOne">+1</p></div>
						<div class="share"><p class="text">分享</p><p id="share">11</p></div>
						<div class="share_popup gray_transparent" style="display: none;">
							<div class="frame">
								<div class="bj-white">
									<div class="fr"><p>分享到...</p><div class="bdsharebuttonbox bdshare-button-style0-16" data-tag="share_1" data-bd-bind="1496905528091"><a class="bds_weixin" data-cmd="weixin" title="分享到微信"></a><a class="bds_sqq" data-cmd="sqq" title="分享到QQ好友"></a><a class="bds_tsina" data-cmd="tsina" title="分享到新浪微博"></a></div></div>
									<i class="icon-disappear" icon-bg="icon_disappear"></i>
								</div>
							</div>
						</div>
						<!--分享功能--><!--复制老网站中的分享功能即可-->
						<div class="bdshre"></div>
					</div>
					<p class="font_size16 font_color_gray mt10 mb20">继续阅读</p>
					<div class="else">
						<?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"content\" data=\"op=content&tag_md5=2c8370627a62984c1aee928b7b4734b3&action=hits&catid=%24catid&num=3&order=monthviews+DESC&cache=3600\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">修改</a>";}$tag_cache_name = md5(implode('&',array('catid'=>$catid,'order'=>'monthviews DESC',)).'2c8370627a62984c1aee928b7b4734b3');if(!$data = tpl_cache($tag_cache_name,3600)){$content_tag = pc_base::load_app_class("content_tag", "content");if (method_exists($content_tag, 'hits')) {$data = $content_tag->hits(array('catid'=>$catid,'order'=>'monthviews DESC','limit'=>'3',));}if(!empty($data)){setcache($tag_cache_name, $data, 'tpl_data');}}?>
							<?php $n=1;if(is_array($data)) foreach($data AS $r) { ?>
							<a href="<?php echo $r['url'];?>" target="_blank" title="<?php echo $r['title'];?>">
								<img src="<?php echo thumb($r[thumb], 240, 150);?>" alt="<?php echo $r['title'];?>" title="<?php echo $r['title'];?>">
								<p title="<?php echo $r['title'];?>"><?php echo str_cut($r[title],56,'...');?></p>
							</a>
								<?php $n++;}unset($n); ?>
						<?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<script src="<?php echo APP_PATH;?>framework/src/require.js" data-main="<?php echo APP_PATH;?>dev/page/service/service.js"></script>
<?php include template("content","footer"); ?>