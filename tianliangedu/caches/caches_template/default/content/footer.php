<?php defined('IN_PHPCMS') or exit('No permission resources.'); ?></div>
    <div id="footer-box" class="footer-box">
        <div class="foot-main">
            <div class="foot-nav clearfix">
                <ul>
                    <li><i class="iconfont foot-n1">&#xe658;</i><h2>优越环境</h2><p>个性化独立教室，优越的学习环境</p></li>
                    <li><i class="iconfont foot-n2">&#xe653;</i><h2>实惠满意</h2><p>专业1对1教学，家长课堂同步辅导</p></li>
                    <li><i class="iconfont foot-n3">&#xe617;</i><h2>因材施教</h2><p>根据学习轨迹，专属定制辅导课程</p></li>
                    <li><i class="iconfont foot-n4">&#xe616;</i><h2>品牌服务</h2><p>经验丰富名师指导，续单率98%</p></li>
                </ul>
            </div>
        </div>
        <div class="wrapper" style="position:relative; height:360px;">
            <div class="footer-choice center">
                <em>--</em>
                <span>选择 天亮培优学校 的理由</span>
            </div>
            <ul class="footer-reasons">
                <li class="item">
                    <a href="javascript:;" class="icon_comm" target="_blank">
                        <i class="iconfont">&#xe61f;</i>
                        <p class="bold">家庭服务</p>
                    </a>
                    <p class="text-left">专属家长会，定期家庭拜访，一站式服务</p>
                </li>
                <li class="item">
                    <a href="javascript:;" class="icon_serv" target="_blank">
                        <i class="iconfont">&#xe95d;</i>
                        <p class="bold">成绩保障</p>
                    </a>
                    <p class="text-left">精讲干练，深度评测反馈，高效提分保障</p>
                </li>
                <li class="item">
                    <a href="javascript:;" class="icon_effi" target="_blank">
                        <i class="iconfont">&#xe674;</i>
                        <p class="bold">学习系统</p>
                    </a>
                    <p class="text-left">引进优质教育合伙人，优质课程，专业培优系统</p>
                </li>
                <li class="item">
                    <a href="javascript:;" class="icon_digi" target="_blank">
                        <i class="iconfont">&#xe622;</i>
                        <p class="bold">目标教学</p>
                    </a>
                    <p class="text-left">培养优秀学子，学科、心智全方位改善教学</p>
                </li>
                <li class="clear"></li>
            </ul>
        </div>
        <div class="footer-wrap">
            <div class="footer-wrap-links">
                <div class="ilinks center">
                    <a href="<?php echo APP_PATH;?>community/" class="blue" target="_blank">天亮社区</a>
                    <a href="<?php echo APP_PATH;?>course/" class="blue" target="_blank">天亮课程</a>
                    <a href="<?php echo APP_PATH;?>html/about/us/" class="blue" target="_blank">关于我们</a>
                    <a href="<?php echo APP_PATH;?>html/service/center/" class="blue" target="_blank">客服中心</a>
                    <a href="<?php echo APP_PATH;?>html/conditions/declare/" class="blue" target="_blank">隐私条款</a>
                    <a href="<?php echo APP_PATH;?>html/about/relateus/" class="blue" target="_blank">联系我们</a>
                </div>
                <div class="flinks center">
                    <a href="javascript:;" target="_blank">@武汉天亮培优学校</a>
                </div>
                <div class="footer_link clearfix datalazyload">
                    <dl>
                        <dt>友情链接：</dt>
                        <dd>
                            <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"block\" data=\"op=block&tag_md5=80522d4442c24717aec4f7c5665a5b43&pos=tianliang_links\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">添加碎片</a>";}$block_tag = pc_base::load_app_class('block_tag', 'block');echo $block_tag->pc_tag(array('pos'=>'tianliang_links',));?><?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
                        </dd>
                    </dl>
                    <div class="clear"></div>
                </div>
            </div>
        </div>
        <div class="clear"></div>
        <div class="footer-copy center">
            <p>Copyright © 2017 武汉天亮培优学校 All Rights Reserved | 鄂ICP备17014969号-1</p>
        </div>
    </div>
    <div id="side-nav">
            <a href="javascript:;" class="side-nav-btn return-new" target="_blank"><i class="iconfont">&#xe6b1;</i><span class="text">意见<br />反馈</span></a>
            <a href="http://wpa.qq.com/msgrd?v=3&amp;uin=3194584708&amp;site=qq&amp;menu=yes" target="_blank" class="side-nav-btn kefu-online"><i class="iconfont">&#xe64a;</i><span class="text">联系<br />客服</span></a>
            <a href="javascript:;" class="side-nav-btn qrcode"><i class="iconfont">&#xe722;</i><span class="text">扫二<br />维码</span></a>
            <a href="javascript:;" class="side-nav-btn return-top"><i class="iconfont">&#xe635;</i><span class="text">返回<br />顶部</span></a>
        </div>
    <div id="popup">
        <div>
            <div></div>
            <a href="javascript:;">✕</a>
        </div>
    </div>
    <div id="readable">
        <div>
            <div></div>
            <a href="javascript:;">✕</a>
        </div>
    </div>
    <div id="dialog">
        <div>
            <div>
                <div></div>
            </div>
            <a class="close" href="javascript:;">✕</a><a class="yes button" href="javascript:;">Yes</a><a class="no button" href="javascript:;">No</a>
        </div>
    </div>
    <div id="loading">
        <div>
            <div>loading...</div>
        </div>
    </div>
    <div id="hint"><span>　</span></div>
</body>
</html>