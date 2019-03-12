<?php defined('IN_PHPCMS') or exit('No permission resources.'); ?><div class="about-nav fl">
    <ul>
        <li class="sb-tag">关于我们：</li>
        <li class="sb-item">
            <ul class="sub-tag">
                <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"get\" data=\"op=get&tag_md5=d9c9438f265c2aa4b899c48e6a2fd6da&sql=select+%2A+from+phpcms_category+where+catid+in%2827%2C28%2C29%2C30%2C31%29&return=data\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">编辑</a>";}pc_base::load_sys_class("get_model", "model", 0);$get_db = new get_model();$r = $get_db->sql_query("select * from phpcms_category where catid in(27,28,29,30,31) LIMIT 20");while(($s = $get_db->fetch_next()) != false) {$a[] = $s;}$data = $a;unset($a);?>
                    <?php $n=1; if(is_array($data)) foreach($data AS $k => $r) { ?>    
                        <li class="<?php if($catid==$r['catid']) { ?>cur<?php } ?>"><a href="<?php echo $r['url'];?>"><?php echo $r['catname'];?></a></li>
                    <?php $n++;}unset($n); ?>
                <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
            </ul>
        </li>
        <li class="sb-tag">客服中心：</li>
        <li class="sb-item">
            <ul class="sub-tag">
                <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"get\" data=\"op=get&tag_md5=d80dd33ce334f82b28637a53d8b14eb9&sql=select+%2A+from+phpcms_category+where+catid+in%2833%2C34%2C35%29&return=data\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">编辑</a>";}pc_base::load_sys_class("get_model", "model", 0);$get_db = new get_model();$r = $get_db->sql_query("select * from phpcms_category where catid in(33,34,35) LIMIT 20");while(($s = $get_db->fetch_next()) != false) {$a[] = $s;}$data = $a;unset($a);?>
                    <?php $n=1; if(is_array($data)) foreach($data AS $k => $r) { ?>    
                        <li class="<?php if($catid==$r['catid']) { ?>cur<?php } ?>"><a href="<?php echo $r['url'];?>"><?php echo $r['catname'];?></a></li>
                    <?php $n++;}unset($n); ?>
                <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
            </ul>
        </li>
        <li class="sb-tag">网站条款：</li>
        <li class="sb-item">
            <ul class="sub-tag">
                <?php if(defined('IN_ADMIN')  && !defined('HTML')) {echo "<div class=\"admin_piao\" pc_action=\"get\" data=\"op=get&tag_md5=875fc26e5b1e806052cb4be21b2ddfb6&sql=select+%2A+from+phpcms_category+where+catid+in%2837%2C38%2C39%29&return=data\"><a href=\"javascript:void(0)\" class=\"admin_piao_edit\">编辑</a>";}pc_base::load_sys_class("get_model", "model", 0);$get_db = new get_model();$r = $get_db->sql_query("select * from phpcms_category where catid in(37,38,39) LIMIT 20");while(($s = $get_db->fetch_next()) != false) {$a[] = $s;}$data = $a;unset($a);?>
                    <?php $n=1; if(is_array($data)) foreach($data AS $k => $r) { ?>    
                        <li class="<?php if($catid==$r['catid']) { ?>cur<?php } ?>"><a href="<?php echo $r['url'];?>"><?php echo $r['catname'];?></a></li>
                    <?php $n++;}unset($n); ?>
                <?php if(defined('IN_ADMIN') && !defined('HTML')) {echo '</div>';}?>
            </ul>
        </li>
    </ul>
</div>