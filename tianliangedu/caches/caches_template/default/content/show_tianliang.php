<?php defined('IN_PHPCMS') or exit('No permission resources.'); ?><?php include template("content","header"); ?>
<div id="detailnew" style="display:block;">
	<div class="detail-box row clearfix">
		<div class="detail-crumb">
			当前位置：<a href="/#!home">首页</a>&gt;<?php echo catpos($catid);?>&nbsp;&nbsp;<span class="sup-title"><?php echo $title;?></span>
		</div>
		<div class="detail-cont">
			<div class="detail-inner">
				<div class="con details">
					<div class="left">
						<div class="tags clearfix">
							<?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"block\" data=\"op=block&tag_md5=d93d75330a8cc5a407942ce7e0e4ff38&pos=tianliang_tags\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">添加碎片</a>";}$block_tag = pc_base::load_app_class('block_tag', 'block');echo $block_tag->pc_tag(array('pos'=>'tianliang_tags',));?><?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
						</div>
						<div class="head">
							<h3><?php echo $title;?></h3>
							<p class="font_size12 font_color_gray mt10 mb20">发布日期：<?php echo str_cut($inputtime,15,$dot='');?> 来源：<span class="blue">天亮教育</span></p>
						</div>
						<?php if($description) { ?>
							<div class="description">
								<p>摘要：<?php echo $description;?></p>
							</div>
						<?php } ?>
						<div class="text">
							<?php if($allow_visitor==1) { ?>
								<?php echo $content;?>
								<!--内容关联投票-->
								<?php if($voteid) { ?><script language="javascript" src="<?php echo APP_PATH;?>index.php?m=vote&c=index&a=show&action=js&subjectid=<?php echo $voteid;?>&type=2"></script><?php } ?>
				                
							<?php } else { ?>
								<CENTER><a href="<?php echo APP_PATH;?>index.php?m=content&c=readpoint&allow_visitor=<?php echo $allow_visitor;?>"><font color="red">阅读此信息需要您支付 <B><I><?php echo $readpoint;?> <?php if($paytype) { ?>元<?php } else { ?>点<?php } ?></I></B>，点击这里支付</font></a></CENTER>
							<?php } ?>
							<div id="pages" class="text-c"><?php echo $pages;?></div>
							<p class="f14">
				                <strong>上一篇：</strong><a href="<?php echo $previous_page['url'];?>"><?php echo $previous_page['title'];?></a><br />
				                <strong>下一篇：</strong><a href="<?php echo $next_page['url'];?>"><?php echo $next_page['title'];?></a>
				            </p>
						</div>
						<div class="copyright">
							<p class="mb10">版权声明：</p>
							<div>
								<p>
									本文章仅用于学习和交流目的，非商业转载请注明文章来源。对未经许可擅自使用者，本公司保留追究其法律责任的权利。如需转载或商业合作，请联系武汉天亮培优学校<span>tanliangedu@163.com</span>
								</p>
								<p>来源：<span><?php echo $comefrom;?></span></p>
							</div>
						</div>
						<div class="like_share" style="display:none;">
							<div class="like"><p class="text">赞</p><p id="praise">663</p><p class="addOne">+1</p></div>
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
						<?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"content\" data=\"op=content&tag_md5=59d3146c936b0bbb61d83c4d89437c20&action=relation&relation=%24relation&id=%24id&catid=%24catid&num=5&keywords=%24rs%5Bkeywords%5D\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">编辑</a>";}$content_tag = pc_base::load_app_class("content_tag", "content");if (method_exists($content_tag, 'relation')) {$data = $content_tag->relation(array('relation'=>$relation,'id'=>$id,'catid'=>$catid,'keywords'=>$rs[keywords],'limit'=>'5',));}?>
						  <!-- <?php if($data) { ?> -->
						    	<?php $n=1;if(is_array($data)) foreach($data AS $r) { ?>
						               <a href="<?php echo $r['url'];?>" target="_blank" title="<?php echo $r['title'];?>">
										<img src="<?php echo thumb($r[thumb], 240, 150);?>" title="<?php echo $r['title'];?>" alt="<?php echo $r['title'];?>">
										<p><?php echo $r['title'];?></p>
									</a>
						        <?php $n++;}unset($n); ?>
							
						  <!-- <?php } ?> -->
						<?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
						</div>
					</div>
					<div class="right">
						<div class="review">
							<h6>相关项目</h6>
							<div class="box">
								<?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"content\" data=\"op=content&tag_md5=dba3aea15cadd9d56fc4ff9def612682&action=relation&relation=%24relation&catid=%24catid&num=2&keywords=%24rs%5Bkeywords%5D\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">编辑</a>";}$content_tag = pc_base::load_app_class("content_tag", "content");if (method_exists($content_tag, 'relation')) {$data = $content_tag->relation(array('relation'=>$relation,'catid'=>$catid,'keywords'=>$rs[keywords],'limit'=>'2',));}?>
									<?php $n=1;if(is_array($data)) foreach($data AS $r) { ?>
										<a href="<?php echo $r['url'];?>" title="<?php echo $r['title'];?>" target="_blank">
											<img src="<?php echo $r['thumb'];?>" title="<?php echo $r['title'];?>" alt="<?php echo $r['title'];?>">
											<p><?php echo $r['title'];?></p>
										</a>
									<?php $n++;}unset($n); ?>
								<?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
							</div>
						</div>
						<div class="recommended">
							<h6>相关推荐</h6>
							<ul>
								<?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"content\" data=\"op=content&tag_md5=f5d0e06eeed3a021ec7329b2346c65a6&action=position&posid=10&order=listorder+DESC&num=4\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">编辑</a>";}$content_tag = pc_base::load_app_class("content_tag", "content");if (method_exists($content_tag, 'position')) {$data = $content_tag->position(array('posid'=>'10','order'=>'listorder DESC','limit'=>'4',));}?>
								 <?php $n=1; if(is_array($data)) foreach($data AS $key => $val) { ?>
									<li>
										<a href="<?php echo $val['url'];?>"><i></i><p><?php echo $val['title'];?></p></a>
									</li>
								 <?php $n++;}unset($n); ?>
							</ul>
						</div>
						<div class="recommended history">
							<h6>您的浏览记录</h6>
							<ul>
								<?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"content\" data=\"op=content&tag_md5=58900d29a2d86f6669bfff23ba8fcaf2&action=hits&catid=%24catid&num=10&order=views+DESC&cache=3600\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">编辑</a>";}$tag_cache_name = md5(implode('&',array('catid'=>$catid,'order'=>'views DESC',)).'58900d29a2d86f6669bfff23ba8fcaf2');if(!$data = tpl_cache($tag_cache_name,3600)){$content_tag = pc_base::load_app_class("content_tag", "content");if (method_exists($content_tag, 'hits')) {$data = $content_tag->hits(array('catid'=>$catid,'order'=>'views DESC','limit'=>'10',));}if(!empty($data)){setcache($tag_cache_name, $data, 'tpl_data');}}?>
									<?php $n=1;if(is_array($data)) foreach($data AS $r) { ?>
										<li>
											<a href="<?php echo $r['url'];?>" target="_blank" title="<?php echo $r['title'];?>">
												<i></i>
												<p><?php echo str_cut($r[title], 28, '');?></p>
											</a>
										</li>
									<?php $n++;}unset($n); ?>
								<?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
							</ul>
						</div>
						<div class="review">
							<h6>扫一扫</h6>
							<p class="font_size14 font_color_gray mb10 ml25">加入天亮家长群</p>
							<img src="<?php echo APP_PATH;?>dev/page/detailnew/images/qrcode.png" width="227" height="225" alt="" class="ml25">
							<p class="font_color_gray  mt10 ml25">获得更多</p>
							<p class="font_color_gray ml25"> 天亮教育相关信息</p>
							<p class="font_color_gray ml25">及免费活动机会</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<script src="<?php echo APP_PATH;?>framework/src/require.js" data-main="<?php echo APP_PATH;?>dev/page/detailnew/detailnew.js"></script>
<?php include template("content","footer"); ?>