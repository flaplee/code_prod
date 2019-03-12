<?php defined('IN_PHPCMS') or exit('No permission resources.'); ?><?php include template("content","header"); ?>
<!-- index start -->
<style>
  #home .entry-box .pro-league .league-event .prev,#home .entry-box .pro-league .league-event .next{
    position: absolute;
    top: 0;
    right: 8px;
    width: 8px;
    height: 14px;
 }
 #home .entry-box .pro-league .league-event .prev{right: 28px;}
</style>
<div id="home" style="display: block;">
  <div class="banner-box">
      <div id="banner" class="banner">
          <!-- banner 内容 -->
          <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"content\" data=\"op=content&tag_md5=15f124974f8eff3b1d2d1b9164a32e05&action=lists&catid=14&order=listorder+DESC&num=5\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">修改</a>";}$content_tag = pc_base::load_app_class("content_tag", "content");if (method_exists($content_tag, 'lists')) {$data = $content_tag->lists(array('catid'=>'14','order'=>'listorder DESC','limit'=>'5',));}?>
            <?php $i =0;?>
              <?php $n=1; if(is_array($data)) foreach($data AS $key => $val) { ?>
            <?php $i ++?>
                <a class="slider-item <?php if($i == 1) { ?>current<?php } ?>" href="<?php echo $val['linkurl'];?>" title="<?php echo $val['title'];?>" alt="<?php echo $val['title'];?>" target="_blank" style="z-index: 5; left: 0px;background-image: url(&quot;<?php echo $val['thumb'];?>&quot;);"></a>
              <?php $n++;}unset($n); ?>
          <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
      </div>
      <div class="banner-nav">
          <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"content\" data=\"op=content&tag_md5=15f124974f8eff3b1d2d1b9164a32e05&action=lists&catid=14&order=listorder+DESC&num=5\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">修改</a>";}$content_tag = pc_base::load_app_class("content_tag", "content");if (method_exists($content_tag, 'lists')) {$data = $content_tag->lists(array('catid'=>'14','order'=>'listorder DESC','limit'=>'5',));}?>
            <?php $i =0;?>
              <?php $n=1; if(is_array($data)) foreach($data AS $key => $val) { ?>
            <?php $i ++?>
                <a class="btn-item <?php if($i == 1) { ?>current<?php } ?>" href="javascript:;" target="_blank"></a>
              <?php $n++;}unset($n); ?>
          <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
          <!-- <a class="btn-item current" href="javascript:;"></a>
          <a class="btn-item" href="javascript:;"></a> -->
      </div>
      <div class="course-box">
          <div class="course-wrap">
              <ul class="course-inner course-inner01">
                  <li class="item"><h4>学前教育</h4><span>天亮学前班</span>
                    <dl style="display: none;"> 
                        <dt>学前教育</dt>
                        <dd>
                            <a href="javascript:;" target="_blank">天亮学前班</a>
                        </dd>
                    </dl>
                  </li>
                  <li class="item"><h4>理科辅导</h4><span>小学数学</span><span>初中理科</span><span>高中理科</span>
                    <dl style="display: none;">
                        <dt>理科辅导</dt>
                        <dd>
                            <h4>小学数学</h4>
                            <a href="javascript:;" target="_blank">一年级</a>
                            <a href="javascript:;" target="_blank">二年级</a>
                            <a href="javascript:;" target="_blank">三年级</a>
                            <a href="javascript:;" target="_blank">四年级</a>
                            <a href="javascript:;" target="_blank">五年级</a>
                            <a href="javascript:;" target="_blank">六年级</a>
                        </dd>
                        <dd>
                            <h4>初中物理</h4>
                            <a href="javascript:;" target="_blank">初一年级</a>
                            <a href="javascript:;" target="_blank">初二年级</a>
                            <a href="javascript:;" target="_blank">初三年级</a>
                        </dd>
                        <dd>
                            <h4>初中化学</h4>
                            <a href="javascript:;" target="_blank">初一年级</a>
                            <a href="javascript:;" target="_blank">初二年级</a>
                            <a href="javascript:;" target="_blank">初三年级</a>
                        </dd>                         
                        
                    </dl>
                    <dl class="cddcll" style="display: none;">
                         <dd>
                            <h4>初中数学</h4>
                            <a href="javascript:;" target="_blank">初一年级</a>
                            <a href="javascript:;" target="_blank">初二年级</a>
                            <a href="javascript:;" target="_blank">初三年级</a>
                        </dd>
                        <dd>
                            <h4>高中物理</h4>
                            <a href="javascript:;" target="_blank">高一年级</a>
                            <a href="javascript:;" target="_blank">高二年级</a>
                            <a href="javascript:;" target="_blank">高三年级</a>
                        </dd>
                        <dd>
                            <h4>高中化学</h4>
                            <a href="javascript:;" target="_blank">高一年级</a>
                            <a href="javascript:;" target="_blank">高二年级</a>
                            <a href="javascript:;" target="_blank">高三年级</a>
                        </dd>
                        <dd>
                            <h4>高中数学</h4>
                            <a href="javascript:;" target="_blank">高一年级</a>
                            <a href="javascript:;" target="_blank">高二年级</a>
                            <a href="javascript:;" target="_blank">高三年级</a>
                        </dd>                         
                    </dl>
                  </li>
                  <li class="item"><h4>文科辅导</h4><span>小学语文</span><span>初中文科</span><span>高中文科</span>
                    <dl style="display: none;">
                        <dt>文科辅导</dt>
                        <dd>
                            <h4>小学语文</h4>
                            <a href="javascript:;" target="_blank">一年级</a>
                            <a href="javascript:;" target="_blank">二年级</a>
                            <a href="javascript:;" target="_blank">三年级</a>
                            <a href="javascript:;" target="_blank">四年级</a>
                            <a href="javascript:;" target="_blank">五年级</a>
                            <a href="javascript:;" target="_blank">六年级</a>
                        </dd>
                        <dd>
                            <h4>初中语文</h4>
                           <a href="javascript:;" target="_blank">初一年级</a>
                           <a href="javascript:;" target="_blank">初二年级</a>
                           <a href="javascript:;" target="_blank">初三年级</a>
                        </dd>
                        <dd>
                            <h4>初中英语</h4>
                           <a href="javascript:;" target="_blank">初一年级</a>
                           <a href="javascript:;" target="_blank">初二年级</a>
                           <a href="javascript:;" target="_blank">初三年级</a>
                        </dd>
                    </dl>
                  </li>
                  <li class="item"><h4>外语培训</h4><span>少儿英语</span><span>中高级英语</span><span>精英英语</span><span>示范校英语</span>
                    <dl style="display: none;">
                        <dt>外语培训</dt>
                        <dd>
                            <h4>少儿英语</h4>
                            <a href="javascript:;" target="_blank">悦思维长线</a>
                            <a href="javascript:;" target="_blank">悦思维短线</a>
                            <a href="javascript:;" target="_blank">剑桥英语</a>
                            <a href="javascript:;" target="_blank">悦思维尖子</a>
                            <a href="javascript:;" target="_blank">悦思维超素</a>
                            <a href="javascript:;" target="_blank">欧文思外教口语</a>
                            <a href="javascript:;" target="_blank">伦敦三一口语</a>
                            <a href="javascript:;" target="_blank">少儿英语</a>
                        </dd>
                        <dd>
                            <h4>中高级英语</h4>
                            <a href="javascript:;" target="_blank">E概念英语</a>
                            <a href="javascript:;" target="_blank">新概念英语</a>
                            <a href="javascript:;" target="_blank">MSE英语</a>
                            <a href="javascript:;" target="_blank">E语阅</a>
                            <a href="javascript:;" target="_blank">伦敦三一口语</a>
                        </dd>
                        <dd>
                            <h4>示范校英语</h4>
                            <a href="javascript:;" target="_blank">示范校英语</a>
                        </dd>
                    </dl>
                    <dl class="cddcll" style="display: none;">
                        <dd>
                            <h4>精英英语</h4>
                            <a href="javascript:;" target="_blank">小学VIP精英英语</a>
                            <a href="javascript:;" target="_blank">小学精英英语</a>
                            <a href="javascript:;" target="_blank">初中VIP精英英语</a>
                            <a href="javascript:;" target="_blank">初中精英英语</a>
                            <a href="javascript:;" target="_blank">高中精英英语</a>
                        </dd>
                    </dl>
                  </li>
                  <li class="item"><h4>兴趣爱好</h4><span>科技艺术</span><span>艺术体育</span><span>托管班</span><span>夏冬令营</span>
                    <dl style="display: none;">
                        <dt>兴趣爱好</dt>
                        <dd>
                            <h4>科技艺术</h4>
                            <a href="javascript:;" target="_blank">美术</a>
                            <a href="javascript:;" target="_blank">书法</a>
                            <a href="javascript:;" target="_blank">科技</a>
                            <a href="javascript:;" target="_blank">口才</a>
                        </dd>
                        <dd>
                            <h4>艺术体育</h4>
                            <a href="javascript:;" target="_blank">舞蹈</a>
                            <a href="javascript:;" target="_blank">体育</a>
                            <a href="javascript:;" target="_blank">声乐</a>
                        </dd>
                        <dd>
                            <h4>托管班</h4>
                            <a href="javascript:;" target="_blank">寒暑假托管</a>
                            <a href="javascript:;" target="_blank">平时托管</a>
                        </dd>
                      <dd>
                          <h4>夏冬令营</h4>
                          <a target="_self" href="javascript:;">暂无相关课程</a>
                      </dd>                          
                    </dl>
                    <dl class="item-list-1" style="display: none;">
                      <dd>
                          <a target="_self" href="javascript:;">暂无相关课程</a>
                      </dd>                          
                    </dl>
                    <dl class="item-list-2" style="display: none;">
                        <dd>
                          <a target="_self" href="javascript:;">暂无相关课程</a>
                        </dd>
                    </dl>
                  </li>
                  <li class="item"><h4>考级活动</h4><span>考级报名</span><span>活动类报名</span>
                    <dl style="display: none;">
                        <dt>考级活动</dt>
                        <dd>
                            <h4>考级报名</h4>
                            <a target="_self" href="javascript:;">暂无相关课程</a>
                        </dd>
                        <dd>
                            <h4>活动类报名</h4>
                            <a target="_self" href="javascript:;">暂无相关课程</a>
                        </dd>
                    </dl>
                  </li>                 
              </ul>
          </div>
      </div>
  </div>
  <div class="entry-box clearfix">
    <div class="hot-league fl">
      <ul class="league-menu clearfix">
        <li class="icons all active"><a href="javascript:;" target="_blank"><span class="link_box"><i class="icon iconfont">&#xe623;</i>语文</span></a></li>
        <li class="icons lang"><a href="javascript:;" target="_blank"><span class="link_box"><i class="icon iconfont">&#xe62d;</i>数学</span></a></li>
        <li class="icons learn"><a href="javascript:;" target="_blank"><span class="link_box"><i class="icon iconfont">&#xe644;</i>英语</span></a></li>
        <li class="icons human"><a href="javascript:;" target="_blank"><span class="link_box"><i class="icon iconfont">&#xe674;</i>小学</span></a></li>
        <li class="icons life"><a href="javascript:;" target="_blank"><span class="link_box"><i class="icon iconfont">&#xe646;</i>初中</span></a></li>
        <li class="icons fun"><a href="javascript:;" target="_blank"><span class="link_box"><i class="icon iconfont">&#xe61e;</i>高中</span></a></li>
      </ul>
      <div class="league-news">
        <div class="news-recent fl">
          <div class="recent-inner">
            <h2 class="recent-title"><a href="javascript:;" target="_blank">最新资讯</a></h2>
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
                    <a href="javascript:;" class="slide-btn pre-btn" style="display: block;"></a>
                    <a href="javascript:;" class="slide-btn next-btn" style="display: block;"></a>
                  <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
                  </div>
                </div>
              </div>
              <div class="recent-content">
                <div class="content-title">
                  <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"content\" data=\"op=content&tag_md5=f254ee5040f7207a0566ebc4701439d7&action=lists&catid=21&order=listorder+DESC&num=1\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">修改</a>";}$content_tag = pc_base::load_app_class("content_tag", "content");if (method_exists($content_tag, 'lists')) {$data = $content_tag->lists(array('catid'=>'21','order'=>'listorder DESC','limit'=>'1',));}?>
                    <?php $n=1; if(is_array($data)) foreach($data AS $key => $val) { ?>
                      <div class="content-hd">
                        <a title="<?php echo $val['title'];?>" href="<?php echo $val['url'];?>"><?php echo $val['title'];?></a>
                      </div>
                      <div class="content-bd"> &nbsp;&nbsp;“ <?php echo $val['description'];?> ” <a href="<?php echo $val['url'];?>">【查看详情】</a></div>
                    <?php $n++;}unset($n); ?>
                  <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
                </div>
                <ul class="content-list">
                  <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"content\" data=\"op=content&tag_md5=a880e97cdccdc9bbb95af2092f37250e&action=lists&catid=21&order=id+DESC+LIMIT+1%2C5--&num=5\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">修改</a>";}$content_tag = pc_base::load_app_class("content_tag", "content");if (method_exists($content_tag, 'lists')) {$data = $content_tag->lists(array('catid'=>'21','order'=>'id DESC LIMIT 1,5--','limit'=>'5',));}?>
                    <?php $n=1; if(is_array($data)) foreach($data AS $key => $val) { ?>
                      <li><a title="<?php echo $val['title'];?>" href="<?php echo $val['url'];?>"><?php echo $val['title'];?></a></li>
                    <?php $n++;}unset($n); ?>
                  <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <style>
        </style>
        <div class="news-course clearfix">
          <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"get\" data=\"op=get&tag_md5=8bdfc83a28fb29a6c6167befeec01d0d&sql=select+%2A+from+phpcms_category+where+catid+in%2816%2C17%2C18%29&return=data\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">修改</a>";}pc_base::load_sys_class("get_model", "model", 0);$get_db = new get_model();$r = $get_db->sql_query("select * from phpcms_category where catid in(16,17,18) LIMIT 20");while(($s = $get_db->fetch_next()) != false) {$a[] = $s;}$data = $a;unset($a);?> 
              <?php $n=1;if(is_array($data)) foreach($data AS $r) { ?> 
                  <div class="course-item">
                    <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"content\" data=\"op=content&tag_md5=de55f8029b751cd7d1f9cf16933777d5&action=lists&catid=%24r%5Bcatid%5D&order=listorder+DESC&num=5\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">修改</a>";}$content_tag = pc_base::load_app_class("content_tag", "content");if (method_exists($content_tag, 'lists')) {$data = $content_tag->lists(array('catid'=>$r[catid],'order'=>'listorder DESC','limit'=>'5',));}?>
                      <div class="course-title">
                        <a href="<?php echo $CATEGORYS[$r['catid']]['url'];?>" class="more" target="_blank"><img src="<?php echo APP_PATH;?>dev/page/home/images/gdxd.png"></a><a href="<?php echo $CATEGORYS[$r['catid']]['url'];?>" target="_blank"><?php echo $r['catname'];?></a>
                      </div>
                      <div class="course-img">
                        <a href="<?php echo $CATEGORYS[$r['catid']]['url'];?>" target="_blank"><img src="<?php echo thumb($r['image'],284,110);?>"></a>
                      </div>
                      <ul class="course-list">
                        <?php $n=1; if(is_array($data)) foreach($data AS $key => $val) { ?>
                          <li><a href="<?php echo $val['url'];?>" target="_blank"><?php echo $val['title'];?></a></li>
                        <?php $n++;}unset($n); ?>
                      </ul>
                    <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
                  </div>
              <?php $n++;}unset($n); ?>
          <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
        </div>
      </div>
    </div>
    <div class="pro-league fr">
      <div class="league-team">
          <a href="javascript:;" class="btn btn-green">组队去天亮培优学校</a>
      </div>
      <div class="league-latest">
          <h3 class="recommend"><a href="javascript:;" target="_blank" title="今日推荐">今日推荐</a><i class="iconfont">&#xe606;</i></h3>
          <ul class="latest-list">
              <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"content\" data=\"op=content&tag_md5=79d92623a8337007f1f3bcdd35d5f304&action=position&posid=2&order=listorder+DESC&num=4\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">修改</a>";}$content_tag = pc_base::load_app_class("content_tag", "content");if (method_exists($content_tag, 'position')) {$data = $content_tag->position(array('posid'=>'2','order'=>'listorder DESC','limit'=>'4',));}?>
                <?php $i =0;?>
                <?php $n=1; if(is_array($data)) foreach($data AS $key => $val) { ?>
                <?php $i ++?>
                  <li class="clearfix">
                      <span class="<?php if($i <= 2) { ?>lv1<?php } else { ?>lv3<?php } ?>"><?php echo $i;?></span>
                      <a href="<?php echo $val['url'];?>" class="latest-name" target="_blank" title="<?php echo $val['title'];?>"><?php echo $val['title'];?></a>
                  </li>
                <?php $n++;}unset($n); ?>
              <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
          </ul>
      </div>
      <div class="league-event">
          <h3><a href="javascript:;" target="_blank" title="天亮专题">天亮专题</a></h3>
          <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"special\" data=\"op=special&tag_md5=94ad5bb9bcf9c1480f17aeace03ca2b9&action=lists&siteid=%24siteid&elite=1&listorder=2&num=2\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">修改</a>";}$special_tag = pc_base::load_app_class("special_tag", "special");if (method_exists($special_tag, 'lists')) {$data = $special_tag->lists(array('siteid'=>$siteid,'elite'=>'1','listorder'=>'2','limit'=>'2',));}?>
          <?php if((count($data,COUNT_NORMAL)) == 2 ) { ?>
          <a href="javascript:;" class="prev"><i class="iconfont">&#xe63e;</i></a>
          <a href="javascript:;" class="next"><i class="iconfont">&#xe63e;</i></a>
          <?php } ?>
          <ul style="width: 1080px;">
                <?php $n=1;if(is_array($data)) foreach($data AS $r) { ?>
                  <li>
                    <a class="ct_event_link" href="<?php echo $r['url'];?>" target="_blank" title="<?php echo $r['title'];?>">
                        <img class="ct_event_img" src="<?php echo thumb($r['thumb'], 270, 110);?>" alt="<?php echo $r['title'];?>">
                        <span class="ct_event_title"><?php echo $r['title'];?></span>
                        <span class="ct_event_name" title="<?php echo $r['description'];?>"><?php echo $r['description'];?></span>
                    </a>
                  </li>
                <?php $n++;}unset($n); ?>
          </ul>
          <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
      </div>
      <div class="league-latest">
          <h3><a href="javascript:;" target="_blank" title="天亮公告">天亮公告</a></h3>
          <ul class="latest-list">
              <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"content\" data=\"op=content&tag_md5=26dbd3c1bc4331e11fc9d3d5a5319a29&action=lists&catid=20&order=listorder+DESC&num=6\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">修改</a>";}$content_tag = pc_base::load_app_class("content_tag", "content");if (method_exists($content_tag, 'lists')) {$data = $content_tag->lists(array('catid'=>'20','order'=>'listorder DESC','limit'=>'6',));}?>
                <?php $i =0;?>
                <?php $n=1; if(is_array($data)) foreach($data AS $key => $val) { ?>
                <?php $i ++?>
                  <li class="clearfix">
                      <span class="<?php if($i <= 3) { ?>lv1<?php } else { ?>lv3<?php } ?>"><?php echo $i;?></span>
                      <a href="<?php echo $val['url'];?>" class="latest-name" target="_blank" title="<?php echo $val['title'];?>"><?php echo $val['title'];?></a>
                  </li>
                <?php $n++;}unset($n); ?>
              <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
          </ul>
      </div>
    </div>
  </div>
  <div class="about-box">
      <h2 class="title">天亮培优学校，孩子的优质课程领袖</h2>
      <hr class="half-line">
      <div class="product-list clearfix">
          <ul class="list clearfix">
              <li class="item">
                  <a target="_blank" href="javascript:;">
                    <img src="<?php echo APP_PATH;?>dev/page/home/images/lx1.jpg" alt="">
                    <div class="content">
                        <div class="title course-title">天亮教育课程体系</div>
                        <div class="info">天亮教育培优课程体系涵盖语文、数学、英语、物理、化学等课程。</div>
                    </div>
                  </a>
              </li>
              <li class="item">
                  <a target="_blank" href="javascript:;">
                    <img src="<?php echo APP_PATH;?>dev/page/home/images/lx2.jpg" alt="">
                    <div class="content">
                        <div class="title junior-title">小学课程体系</div>
                        <div class="info">天亮教育小学课程体系注重培养孩子的人文素养，提高学生逻辑思维、发散思维的能力。涵盖巨人大语文、E概念英语、思维数学、特长等课程。</div>
                    </div>
                  </a>
              </li>
              <li class="item">
                  <a target="_blank" href="javascript:;">
                    <img src="<?php echo APP_PATH;?>dev/page/home/images/lx3.jpg" alt="">
                    <div class="content">
                        <div class="title middle-title">中学课程体系</div>
                        <div class="info">天亮教育中学课程体系以学生为主体，在实践中培养学生发现问题、解决问题的能力与批判性思维。涵盖大语文、数学、欧文思英语等课程。</div>
                    </div>
                  </a>
              </li>
              <li class="item">
                  <a target="_blank" href="javascript:;">
                    <img src="<?php echo APP_PATH;?>dev/page/home/images/lx4.jpg" alt="">
                    <div class="content">
                        <div class="title vip-title">1对1课程体系</div>
                        <div class="info">天亮教育1对1是一所规模较大、科目全面的个性化教育领航机构，汇聚众多名师，打造了一支专业化的教研团队。</div>
                    </div>
                  </a>
              </li>
          </ul>
      </div>
  </div>
</div>
<script src="<?php echo APP_PATH;?>framework/src/require.js" data-main="<?php echo APP_PATH;?>dev/page/home/home.js"></script>
<!-- index end -->
<?php include template("content","footer"); ?>