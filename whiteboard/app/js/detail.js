seajs.config({
    base: './',
    alias: {
        util: 'js/util.js'
    }
});
seajs.use(['util'], function(util) {
    var Page = {
        init: function() {
            var self = this,
                urls = [];
            self.bindEvt();
            // 获取分享内容
            self.dataHandler.getShare.call(self, [util.getQuery("id"), function(data) {
                if (data) {
                    self.data.meetingShare = data;
                    $.each(data, function(i, n) {
                        $.each(n.screenshots, function(k, j) {
                            urls.push(j.img_url)
                        });
                        self.selector.$houseList.append($(self.viewHandler.list.call(self, n)));
                    });
                    // 异步加载图片
                    var imgs = document.querySelectorAll('img');
                    for (var i = 0; i < imgs.length; i++) {
                        var url = imgs[i].dataset.src;
                        util.loadImage(imgs[i], url, function($o) {
                            $o.nextElementSibling.style.display = 'none';
                            $o.src = this.src;
                        });
                    }
                    var gallery = self.methods.gallery(urls);
                    $.each(self.selector.$page.find("div > div > img.item-img"), function(i, n) {
                        $(n).on('click', function(e) {
                            e.stopPropagation();
                            gallery.open(i);
                        });
                    });
                }
            }]);
        },
        data: {
            access_token: util.getCookie('access_token') || '',
            meetingShare: {}
        },
        selector: {},
        methods: {
            gallery: function(urls, index) {
                var $gallery = $.photoBrowser({
                    items: urls,
                    initIndex: 0,
                    onSlideChange: function(index) {},
                    onOpen: function() {},
                    onClose: function() {}
                });
                return $gallery;
            }
        },
        viewHandler: {
            list: function(n) {
                var self = this;
                var detail = self.viewHandler.detail.call(self, n.screenshots);
                return '  <div class="dl-detail house-detail house-index-detail" id="' + n.meeting.id + '">\
                <div id="house-index-detail">\
                  <div class="house-index-detail">\
                    <div class="house-detail-title">\
                      <h2 class="detail-title dl-ft-ellipsis">会议名称：<span class="detail-name">' + n.meeting.meet_name + '</span></h2>\
                    </div>\
                    <div class="house-detail-inner">\
                    ' + detail + '</div>\
                  </div>\
                </div>\
              </div>\
              ';
            },
            detail: function(n) {
                if (Array.isArray(n)) {
                    var self = this,
                        row = "";
                    $.each(n, function(i, node) {
                        row += self.viewHandler.detail.call(self, node);
                    });
                    var result = ' <div class="house-detail-item">\
                                ' + row + '</div>\
                            ';
                    return result;
                }
                var remark;
                if (n.remark) {
                    remark = ' <div class="item-desc" style="display:">\
                    <p>备注:' + n.remark + '</p>\
                    </div>\
                    ';
                }

                var result = '  <p class="item-date">' + util.formatDate(n.update_time * 1, true) + '</p>\
                <div class="item-cont">\
                    <img class="item-img" data-src="' + n.img_url + '" width="100%" height="100%" />\
                    <div id="loadingIco"></div>\
                </div>\
                ';
                if (remark) {
                    result += remark;
                }

                return result;
            }
        },
        dataHandler: {
            getShare: function(params) {
                var self = this,
                    data = params[0],
                    callback = params[1];
                $.ajax({
                    url: util.config.apiurl + '/api/open/screenshots/share',
                    type: "POST",
                    timeout: 1e3,
                    headers: {
                        'token': Page.data.access_token
                    },
                    dataType: "json",
                    data: {
                        'id': data
                    },
                    success: function(res) {
                        if (res.code == 0) {
                            if (typeof callback == "function") {
                                callback.call(self, res.data);
                            }
                        } else {
                            $.toast(res.msg, 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                        };
                    },
                    error: function() {
                        $.toast('网络错误，请重试', 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                    }
                });
            }
        },
        bindEvt: function() {
            var self = this;
            self.selector = {
                $page: $('#page'),
                $houseBox: $('#page').find('.house-outer .house-box'),
                $houseList: $('#page').find('#accurate-scroll'),
                $houseItem: $('#page').find('#accurate-scroll .dl-detail'),
                $houseItemImg: $('#page').find('#accurate-scroll .dl-detail .item-img')
            };
        }
    };
    Page.init();
});