;
(function() {
    var shareConfig = {
        /*text: "我是对话框标题",*/
        title: "得力分享demo",
        desc: "得力分享内容",
        link: "http://www.nbdeli.com/",
        imgUrl: "http://www.nbdeli.com/formwork/default/images/logo.gif"
    };
    // 注入配置信息
    deli.config({
        noncestr: "abcdefg", // 必填，生成签名的随机串
        appId: "373175764691976192", // 必填，应用ID
        timestamp: "1508755836143", // 必填，生成签名的时间戳
        signature: "26fcd1cab8ff455bfea0ee59a67bf122", // 必填，服务端生成的签名
        jsApiList: ['common.navigation.setTitle', 'common.navigation.setRight', 'common.navigation.close', 'common.image.upload', 'common.image.preview', 'common.location.open', 'common.location.get', 'common.message.share', 'common.phone.vibrate', 'common.connection.getNetworkType', 'common.phone.getUUID', 'common.phone.getInterface', 'app.device.bind', 'app.user.telephoneCall', 'app.user.chatOpen', 'app.user.select', 'app.department.select'] // 必填，需要使用的jsapi列表
    });
    var Page = {
        init: function() {
            var that = this;
            var i = 0;
            $("[data-type]").on("click", function(a) {
                var d = $(a.target),
                    e = d.attr("data-type");
                switch (e) {
                    case "setTitle":
                        var params = {
                            'title': '修改页面标题'
                        };
                        deli.common.navigation.setTitle({
                            "title": "页面标题"
                        }, function(data) {}, function(resp) {});
                        break;
                    case "setRight":
                        deli.common.navigation.setRight({
                            "text": "确认",
                            "icon": "http://www.nbdeli.com/formwork/default/images/logo.gif"
                        }, function(data) {
                            alert("我点了确认"+ (++i) +"");
                        }, function(resp) {
                            alert("我点了确认"+ (++i) +"");
                        });
                        break;
                    case "close":
                        deli.common.webview.close();
                        break;
                    case "upload":
                        deli.common.image.upload({
                            //type:"", //无参数type表示可以从相册或者相机中选择, 有type且值为"album"时从相册中选择, 值为"camera"时从相机中选择
                        }, function(data) {
                            deli.common.image.preview({
                                current:0,
                                urls:[JSON.parse(data).data.url,"http://www.nbdeli.com/formwork/default/images/case-li-img4.jpg"]
                            });
                        }, function(resp) {
                            alert(JSON.stringify(resp));
                        });
                        break;
                    case "preview":
                        deli.common.image.preview({
                            current:0,
                            urls: ["data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB\
                            AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEB\
                            AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAB4AHgDASIA\
                            AhEBAxEB/8QAHQAAAwEBAQADAQAAAAAAAAAABAUGAAMCAQgJB//EACkQAQEAAwACAgMAAwEBAAID\
                            AAECAxESISIABBMxMgUjQkEUM0NRUnH/xAAZAQEBAQEBAQAAAAAAAAAAAAABAgADBAX/xAAtEQAB\
                            AgUCBAYDAAMAAAAAAAABESEAAjFBUWFxEoGR8AMiobHB0RPh8TJCYv/aAAwDAQACEQMRAD8A+7+L\
                            D+NP/wAXiWmiSVt1bN6MiTVVPsamYqiROUYElYo0Gx3Lc45Z2H7kl6P6uv41e/HrUkZ9X7X3cX+y\
                            /wB0l/jT+EEceNDHkpNVkepdBW5JEGOP7X3cjIkPnVljEPjV1MtXUq5B53qpYfya9j4QmF1PNbq5\
                            yH9jHt/FMocIzqhdGR3eKfFQyPI6pSqalqZp94dz69Uk+bKll2RkgDseR2u5DquaSZ/naS98rzvU\
                            HjdtBzpfkrj+x9qGULqQKqmSf9kOTitTuadkXWN3pfbGUaCY+x9zJzzV9TU70zDerHlvlDkdpsZ/\
                            dDQM7iKZIL7BEK7tQ/e/EWUgDcB8V/ekVUfY59tp4NdvgeQ2Psk+JrY8/upPJroZXGS/rVSdp663\
                            M1L/ANjybnferXdeObksmT7uIlnVacfjpXxaTRqql1S7va0b6K705+x93y87Z0pPUFH6iJojdDUy\
                            rVjO6vrxEM/kMqMS9XOGX+1pmvwqp4gAEqQ1O/0Ir5zNFyZEaqpCTFkr1yTNMaok4nwRS1sK4vR2\
                            R+cqg3U0k1o5p8Wmp3cNKKAstQNUSaCIx393KdjdzNbO1ne6E8rFc+3mdOQjhiuq8sMN5wSrvExU\
                            zDLpBnSr09LlMj0nqMdBdNU8cxZCCxDZRjXJaq6JEnwgH45fRfeixYGedlU+d+71PNyUpVUnUnsK\
                            ugadrIj4ftY6jnryzp/sZ0SRKWSlCjTz0NL0MpEpmr7uN6aaWq8hYkoW6N0IR1r/AN9ppqdZJQ+v\
                            tLa2vtrRjrgpfauYyLO6dNSBPTVMlVaicymhJetBRFB7RawDwwW4pUABPogFeXtFhf2h37evNMkM\
                            s0T5P5Ee2vCVvJwpp538fmZOY9ZS8k3IPTVck1HqjdtUoy+a2rTRLT+egOp3BsmkAqKfJRdyIyQK\
                            3Yu0N2vUPuzr1rJLwaqnqVW029U27jmV0n/mM3Ymc2lw5xn3Ncxh4cppPLgC4DDpTtg2yfYIY8vE\
                            mW3z60J5TT5mDdHIl9M6rxvvi+zjqVKT2mtF6iW8gtl9OYGKqw2m9A7qWULi+23ke6qXfnSb5gpn\
                            fFU7SlqSmeaSQNnxX1vsfiK/JTPXZotj943c9PgSUPxcktNWNHVYTTJRbLV9fj5h4JVAM4GrUOK9\
                            aaxSYfuO3SSs648Fcr6j+t0JPNrUt1Ukc8W75OfXw/aCv6SdNBek6skoUmUmXtJelGTqqX5vhxEl\
                            wbUXIsuF6iH8QtP0TMvs/TIaLnLdaNVvofWjTutTV74a6ijqdIkJvx7MMX2CLCtTElHSh+6xzMxv\
                            UaqquQpm64dKY+iTxfdZArQ0dO9td8pI9s75B6f6PZo2p8Lx/wCRsl7mhFkeOOjSlnPT68nNUU2j\
                            +VIJLrilLUt2lOrQcM4qqHVCtHuwRtqxVTlnI3JR1BtmWHVm0reqo/UUvg9glF18JjLLhqYmTJNn\
                            RtmSuCOd2NVPSyXyvEusazySGH7kikxkaNfySOtIwVeG9+27tbqO4muqla+F4/vVJI45SBnIFc5F\
                            8kUUlXDu+rheq0TV0K/Hil2Gx+ogyTVT2Sy3T6WKj81YpkWkHRHl3qZ0r7XINpfLQSFHPK/Pf5pm\
                            aaaRqsjRF1VMn72qN0SQBtpkA8Cz2P7gHSVtqWpVXdGtVW669lQj+dnUzKX8On7E/jIiuRVm2Qrr\
                            Up2Y+Zmp0Vphn0kbhDreUmxO+3I23paHzyi6baA1SwIfpDj/AOiom/apr/mfBpo5TbNH/fKUfoHz\
                            Vq+4+0bCa880k790Ui0CmqmbQp3CJXVb0yhzZfxiDarI3rXlkappa5dLyNRKwl1OR86PtRyZDlnc\
                            /vU0Vv1dWCZCucc1a1FcY6RqX4lNAiVsF/TajSJAJoIoryqNtBQEk0cDNTJ41veq0E+ajVcoLvmf\
                            Yg5Ojckr13ByG3mr/TNSXXT1GzsH+Vn/ANJkhSu43353rmajmWa5ZYqR549bHxvR8Hn7WLF5m2ce\
                            MJYkjjYoEzsQ0eZ6DnwV5Pk8YdKr1p6o3LYQ8E2PbrFFDuNunwUVWp3Uhp53NHP9p5mhnQhr4biz\
                            Brd1jtXRqSrmvXzocbjxFgdbQ/tZXqdx/ahoqb3vbVOtgBVE1KT5MZqSVLKSVKfnWMxdf/2JrRJu\
                            kNeKquhF9pY1LBN730c7jCK2yv2vo+kYSEoxHVtx8llvDtyGSiqiN68HZTS7mZbsRn/2NP607N7j\
                            oZOup5NM8kD+9nNVjl3tZJTUsta08i/FsfZxnB+T2b/HJun+RJ9pYmZPbJVVOijbLpmemOzIjOT+\
                            je4nWg2psSyea0nhB1DNfquIM4fUf2MZUyqMxoUU6WN6ijw4w/igt0UfyTFbiK6GWQKqk2PikoS5\
                            ZdU758SOOYuWV1/2/wDVwalebRXwkk+pARbzPzfAkXL7gXFiewsTy6/pO+sfw/Di9n/XqA5G6OX/\
                            AJuYJgeI8E1y7petS4w7yRVbslJrn2ql66nr0A2zuZ1F0fkaUEsqX+v9zOkp+RPF1j5ufxG25mvy\
                            JzR/ZDM8whkksO+0/Yz1SPZPcdX1XUePfiGGtksc0U4hb73Mz3zE4tLfBYlHcNbGkdTJNQzYuSLY\
                            FL35xXY3GCsF9EE/w6dHXldfody7pksKTkrqGPIqSEdaQal0CEyOmZZ4SUh9aV9nU9H2aOJDc1dN\
                            XtidrrGFhrJWSsr6llUBpoaEus+Xa8za7dJ4NKlf+zqZNY5SCGeb0a3fGMUbajDflSkHBNn1NqQ6\
                            qZmjHjB1Q0WqMU7SqJMcvPTvZP8AMBrzJEEh1upBB11yCyhyVW7ET22zo8vd5KR4sv2LkHsoTfsJ\
                            Ds5GpGq3dO+ipOTf/kfCZyZMbwTzOhnzuNCb8z7OyWo2VLrcgBqeIEqjrvh96oKX3QJ7zJjcoHVq\
                            DNXh3xK8+aCdou0AGmP6vJ14k5x0LvrzMT8Ij6sPIZN+KrHXmgh/S0gOnQP+z1Ns/sE59y4lndky\
                            Lf8AyPkJROnlOu2F9E65OpCY/wAjySppWRHXt6lJ7X5TpmBdr5x7qjpJkrVA1Ube375ssniJ5SnO\
                            nekNH61zUg+vU9eNqMx5olAk2mtM6kuqKJx35P8AGl1Xtq/FKbt5/b7GslVb4a2U114/dHOP8gVp\
                            SmtW2DVamTWp1jetrQTjkyUyQoA/Cv8A7scTtNR5oKZPXdVL1NOuTXTLogDYvPwBlNQnM9/cST4j\
                            oXy2RUh6v2Yx9M49dq45rbOlrc0bqANlJ4aqKSuXnqknF9CuGnTZWyrZ6d1TE84+dkhEzYVqeDIt\
                            djsX3cd17ISDpaez230iMtbJFnuTwb6LmjseeaZBEZfYrSSUHKs0zHLNJPX/ADJrd/AiVWLHKtz1\
                            ipT4gDtRdaE9BjMCn+LrZR0nP7KO3aEWvlr8dVWQ4lGayVzx5n2f47JO+bMjNBNVdrXFAVfit/o2\
                            Ojr+nc5KG+PLikJXRyhqraZB0telarU6yU6SUfy99BeLLhanVTyxpoJ0VfMnXZ+qKmZjqm1lZpIp\
                            RLKQpKFNgt97ajLwGecMXA0FAna6kQrw/V+xl/FFNOPTk80gq9O0WCZV9U21U0kzua3ylicd08ht\
                            roAgRrqBDIZKDW568P460fju/m+YSg1JNlCnH/OO8PFMf9UoGG22r/AMfVfF984Qk49Zannr9GKt\
                            9DWo8VVduTcJMrxT3x/5DFWbVIVjffermHTRP7ryTqmJBF3VTHFZJLH/AJCUorWJuuXZy/k7T/XR\
                            Lbv2JqjHuplma66ltizwR+TJWJr8mo3O9NE6GeIWZxpOtKykdF18ZeIYdK1IGGLJ0DtHOZGQGyVo\
                            g9vTolPg+9iqwliOg2eZ6LGESpHR6E5JtHrZ/Egdf2MDTMO/NV+g8wnJrSiIz6/7BOt898SkZIBL\
                            SLBCelx8Sk0Oyd1V3O6lG6ryMrcHTkmoKEySqA6SpYd115oxsM8x/wBaL0zdT8xM2QMBtPt1semA\
                            l/6stMjcl9zFFh+7j8ITNHHXg1NJp3tealZkNu0JLx09Se/ax5t0U7TaSJOR/wDfYGtH7LjY76op\
                            kPk1ggudNLLVSzT7KCS34qTVf9ES++uvNHwnf46pezbJPmf2sz01Wr/WwGq1xKBTi3QUVRypTlgO\
                            cn1hHDmZs8sdttFDNYckK7lHnW/D7bpTlfPaPhxbmXIgDJMRg8zVST+q9C+jzO2Zph89T48m2d+q\
                            s1+SqdS6dpuTG009qip7m6o3LNlvItUBROVIrdjfhPVNlS2zVnazTM60aOQ0uNTiVRwqlqjGPiMl\
                            POi0c8sfDskVGPFhYSV80hPWiprfnovYdkknPnXKBrZh9XFkF5miZ6J6B1srU6Xxya3o2a8i3qZw\
                            RnF3kqHySz7czyP7VpGZouvMs27BJcdB9e6nmSzdf/zU9dR7USD07SdCmt00guxBUyEaC7pRk0se\
                            kYCagnX95ZtKdVhhj+pjyXK0EiOkhqkcelKKK/o5oAKo011D8NxfVIBHJWmSWwk2ya3UyC6Kq+PQ\
                            uqAqaqZExtz515Z9Hc9MwnnlbUOxPZ10FD0nzrjyXztfE9Hh10734xzX80J6y01P71zPzAS4JYG5\
                            LjROzays9OIVorlUOKU+WENMn1x/rg0Or6qWckyc7deFreTU0aTby2J3+t9ZklKlOqp7nrvzP6gm\
                            qdKM2D4dgUr8U/mzhMpQyFLvHUNCApW6omjqqdaKHyj0Zi+3cAVBU7JxlU+y7e6g6xtz0nWiqV5d\
                            WGTeTFnrjott+sKT2ITlitKW10h9hxUxo8m9Kf3VhXswm6dBr0s3zPncfN89/Tz3XFSLY+cnMSV5\
                            WD9SwPmuq5rqWadXBO+AJDAqNJdhfstmEGZlFncVX6f0j6ORypc3KxSOpstqr47ZZkkxqZ+o3DCM\
                            aKhWP12pxzTk3Esw1z7BSPpMxoua9jmePx+6clRErH+SllZdbRdT4BgJnWhJ5bJYKuV/IG1VhP3z\
                            U1FWHqzJTdVNUpXPtVdSpdzNNJ3vX45+dAlR2qfCJyDCOSzI6hQqG9KZ/sWGO6kK/JfKxc5JtOah\
                            NZDkitzcaNps1oqKqvhOPjc3NbicYMWDPDQzUIb8PMk7LLRES+pmPtvB+RJaSJqISakdM31zqmiq\
                            i7bqF1LaFSxwf5GecY5KGQpqmWmv63DuQ7m2amtQtOQ3NI4gGw1z38RlmFC5TUdHQ2yNYpfrOarm\
                            guZHlsuVqfLvT14Cpvfcba8Emro4vJzyTXIcae+thyVTpdAa2u56rdAEqj6/3cahsmhoeWScrSv/\
                            AKSiJT417lPXn2YxmkCdWak6L2KdPrM0TWj8dyjwvAkc0V8nhFASOZalunXaATkIsoZlQlaI4CaB\
                            XHOCYq9nM09qGynxo3yM1CKczt11SM0tynx9nKWoX515JK8LKissT+nwLt6daXS2PsY6ZB3+MdKf\
                            1SdS708MnlRyVp1Tsn4y+tmjcS7ev5VGV/HO5Onx/J678y70rucJZhSbtu+SULWJwyyjvl884Y4f\
                            spRjdzNe863T+w3KhuelDSJvXOqVbfXzVyVUJVdVRNbrRW09TpndeDTenWiWviqKiq46VSaqSKTZ\
                            W6Z5rdPlrhtoNGiYvlziSZn/AF/vQafFb1ksXl/GJP8ALW+f3cpIBkmLkqBucU7xcxh4shUBroiY\
                            9fqsG4furRWuSoda37SPUal9FWamnQyP6xtPwvD9r2/t8eaErlkJNBMzVDrW6Ui7qzU8zIsM0Awd\
                            8s1UvP8A+NpaadWysvGOStNvQzLR2xzE1PcRuMiNdPjcbn1Q5eK0QvmMhJfTPSRMAAC7K42Qadup\
                            hWQ2IouujWudswyx/bx9k0uyyE3tTQUpMtUlVO3Lzo6F0TNnHGTd0zZGUqKySlyaYqxTcqXk74pM\
                            k0tCXm2mjHisQykPlZdVce0GSdtWVZXskpEzRBPOSdsvr/Xza32Y91s0nTHldxSiyWNQDqpq6WNf\
                            DzBGBJTK/pGwB1Q8tiQj82pdeXskUf1Xm1dA1X87DpVH+EXYAPrSAHWpd8BwzUfknnQlS9bKl2bQ\
                            2KE3Xvmmhjpo1XU75lAYgkhLcSUYFvpS2uRf9+pe3fIPj88cOWJr+8j7aKmNzREx+PQLSWtfrHOi\
                            cUs0Bp39b7UFQn5H/U1DkAnIyxU7U9UxjxMS1HNOtZDIQsZcgAzlobxou6oGpLkadr4qmCt76h5l\
                            EaRmynFNr0jUs304+Yok2qP7Zj8ZWNZrqzxVhkDAkdpsp6teADiA8wZMUZ7DG9MRYXmx5o9VHom/\
                            ZholK0RLMpscZ3MnTZcTCtlfVqvWnJJpN8qk09VunkqfB4aE33upfk5jand1luiuAxM+2Siu26ni\
                            sn5XKCDdEkz6uXbJ2HMSb6qg6dkztu6Mk3PqPW/B5qpambUOhXSm70z8NWNLKXQ3y9nGiu3LEWeH\
                            LEY6ayesu0j8rE+N8m56yMoM3E+KOYkqZAxyZadzdVN/kdY2vKEVN6x62KaoJ6N1pNXuPx5suRqT\
                            GtFO8dc1uhrXTO5kZv8AQu4/VZLg2zjJkx3N2H45ZuXxlSZkPSkxgx26AKceuf8AU8zBIVCoo7op\
                            5ozF1vFiUh1BOq130z2KOcn2McUy3ZOi58DM0tbEm1f068y8OvaTpz9b7Ng6bbrfr5DZwKseep/Z\
                            NFa6Z8exM9H2t0TVS261vRxLZd6NJyVEL7TP/N8tblg50SijtWRlDXLv1p3FUDf9CbbiJ1VJQATF\
                            6+5U87RBExLhbUHr9/TVX1vu2y11U42pmuBPIzK3QM0FTPlnUzjluRQl99f/ACPVEz1qaOsYNIGq\
                            h6jRual8rJzFUlbH5F/WyX+LHN1OuFrvlpIyEbLeZdSap8TTaXMB8dYMsm18dPU/2D4mFkUYo8yS\
                            cavXga2nEC3F1SzN8KcMQBE8IBHl2ZOjViwxfe9q6VRvqoDcz3GplqvZ2arrk5I3t1yZj+3jWTqq\
                            KqGn9Bqdw9c0unXU1UzdCrzbLMYvs400k6PJU5Ct68DPIb/rVXLQ1f72CM8dfXy81NpUmTrwcFzf\
                            Btp3Jwj6OTVK/loMY6oY3c5IRA42d6XikA/yB71HRPUVD7F9yZi1yVuUpZmlXH46iWNaoSZjC132\
                            vLVY6ttH3IELpn2rU3F+Kjk3t4d9Tc936ulx9QyxJxjn8hTR617C9ytQTtm/aOVo6gxlLuup7qSe\
                            SKNUnOp21qen9Eu02+sE2GnhnfQ0qQHHR8d3YVjJKbkb8sc4tY/yMxJyOQkkoOna/jAoF8k1VVFP\
                            UEBy3XXzfJfBgy5Im5qgJ3V99eKkr10oRVOp4ploA7Vn5vnJJyVoqZyMY+FqDHQDwkCl+enSp7D/\
                            AJ14P8t1jrcptmHbaq2TNzEhRjHlLZucUy5rpjGJS/V+9ur11Qa5n3kJJ7qvWTaHft0yy8Ve6tf5\
                            r9D750f/ADMOQIp3f+wokyOW6C6/LMuJxX200xqmt1Nh9L7NEs64sncP+zUtUMVLWOybMZIs9s8Q\
                            0U5FrqhBD7qPodqroh80plCSgIypyVP6kXv1vtxbKzOSK9itJXSwdQNfjdzMDVEjvWO2a9GR9rFQ\
                            9S5Gnk6qG663JuDoZh4buhk0tzIXuR+p9j620pnFanLIWPlMmpr1xk2LX48j/Mq1PkoMGXBeOQto\
                            eimdlRQzSWaZ3Qz+qcdTcOIjqCXugXvnFSzykgEFfT2J5s0UGB+uPWoGiMhrh1q3prHLdx2FWw1O\
                            SfWvxz3PZ+4bIbdbmqcQU4gcczzDQ1ubLm9WG9N4/L8QTqTc56xyu3Fw1NRE1M48vhJOcf5Jmd0V\
                            pa2VjTFyFfuJECcYPORolfM9epONqOaPFSsFSfAhDStxq76HPWKBCoJyEVsDkcotHe0UH+Px48lN\
                            RnxZKnsApyWVF8aolOWGWXao3Q6vxdH9X6M5FS3Vc8kvryFXdxUB3eoa5jrbDT/SMj9WM8ZidkYz\
                            IRK5bGi4nJja3Iy9LJNqZGu/MFq8M/2cfCn/ALPtjLukhlZWZ36Y/XdR1kx0FsEZDITAGxO2qeoA\
                            u1oVKESzBvdRc6l1RvSqxf47JMlP6301CIYyzqq/Q8wPr2Y1iC0pQ+b+t9gQCq9ZT28KHNFEuhdq\
                            ankutZOfWgP6/wB3ORXU2OTV82VuU1v/ALKaJnjW6l6tTVD8YYfvZNU1JXHoeQ5rrH7RXW+lE4s1\
                            c3PtipbqDKFvKtLioGdzU2e0VKfEdRKTyuiJ6lfWOn1MWbHUFeMjFFzVFXTFQegTEcgzVOjnIlb4\
                            fx03jNU44qIvhmQLh2bm0tX2mqNFFHQ3vXi6BPrfe41NC+wM1wlGnvXNUnLXKXZfUqN6m0yftfX3\
                            OzQjR+Qdamnp6rwzK66RevFJ4SgJQCAddaNZbghLxlmYmW1tU7+GMER9nS6Q/wDOKuhl41ikTxT3\
                            cgs4/FLotkovF9kqqPOmtAvJzUj6uq6Av+PDtNWaJeU5PrNv+wmWNkzMm/41W3G1uZKkP1T1LNjj\
                            fnq5wY5msdm5MegqaZlWp010z/XINLqXbTyuAIuCG+PinJhaZiFHlmBOhRW7VtYc4fs2HrMnVTdI\
                            UrHq3UEVD3wVjWqit7tjkYvfEuHC5Sf92Sfx1jCdd8JSKSTidcuqv2j/AK2Vub3wdXb+yrVb6pgJ\
                            XoBLKgKdbtnbrtH5f/S+7jaTGpA0ezBITVrklXT0sFRTNdWqSq5LLD92L/FP5Y3hrr844rN2VGNx\
                            dSkVbQDPrE1mdpEze+b50mmJfYHVxXvEeYSSqa/4k81lHyYoMWWvyAZK7qZqqabx1vn8k3Ccnp+M\
                            jGs+K6BNzD3D9wKmxSf9cv4+a0ZKm6fHjJP90ITNzOsdQ2vzfN8mUkhTn6ikDDHrVjo9If8A1/tW\
                            Ky3PLLF9t2tkEnrKOMnXfLMtNXooGmuD7dvtN0NzPFs8rNMWbnXOpI5n8kVZ7Le3JLvm+XY6BtHE\
                            UgAG5+Psw9+r/kLQxtITrnUnrKGNmV1BSkrK754p0agbT93JQ8tzT0kuSjxUbtHE3+6Cd9ddUoUQ\
                            183zfCNYbn4+4e/WytRG6rIXjopDHqU/db2VTqvUXI3j9rVCvjP632pvHi5Apia58NQ1J/fN37TN\
                            csnUeKmW5eY3zfC4GhPQj7iRWa7j2B7+4Z4ub9y9DVDyk1SJG4DcB/8A5WwqutU9HVqHzFJvzkW5\
                            2PpQWyIcw75fyhqaUnknfN8x2FR6kd8hFykghLkLHXDFVQmVqMaj4opWtSamqSulR8STray6WGPU\
                            DjaGb0ULVQyzW/8A9hKVoJkWGHwi13vm+EoCDULU986xjPMfS2E+rx7jJ9hoPUx8SeUrTsU9Xav7\
                            pSd1s7mb4nfN83xTcc9vqmCYBOSqoxIpVEr07KR//9k=\
                            ","http://www.nbdeli.com/formwork/default/images/case-li-img.jpg","data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB\
                            AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEB\
                            AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAB4AHgDASIA\
                            AhEBAxEB/8QAHQAAAwEBAQADAQAAAAAAAAAABAUGAAMCAQgJB//EACkQAQEAAwACAgMAAwEBAAID\
                            AAECAxESISIABBMxMgUjQkEUM0NRUnH/xAAZAQEBAQEBAQAAAAAAAAAAAAABAgADBAX/xAAtEQAB\
                            AgUCBAYDAAMAAAAAAAABESEAAjFBUWFxEoGR8AMiobHB0RPh8TJCYv/aAAwDAQACEQMRAD8A+7+L\
                            D+NP/wAXiWmiSVt1bN6MiTVVPsamYqiROUYElYo0Gx3Lc45Z2H7kl6P6uv41e/HrUkZ9X7X3cX+y\
                            /wB0l/jT+EEceNDHkpNVkepdBW5JEGOP7X3cjIkPnVljEPjV1MtXUq5B53qpYfya9j4QmF1PNbq5\
                            yH9jHt/FMocIzqhdGR3eKfFQyPI6pSqalqZp94dz69Uk+bKll2RkgDseR2u5DquaSZ/naS98rzvU\
                            HjdtBzpfkrj+x9qGULqQKqmSf9kOTitTuadkXWN3pfbGUaCY+x9zJzzV9TU70zDerHlvlDkdpsZ/\
                            dDQM7iKZIL7BEK7tQ/e/EWUgDcB8V/ekVUfY59tp4NdvgeQ2Psk+JrY8/upPJroZXGS/rVSdp663\
                            M1L/ANjybnferXdeObksmT7uIlnVacfjpXxaTRqql1S7va0b6K705+x93y87Z0pPUFH6iJojdDUy\
                            rVjO6vrxEM/kMqMS9XOGX+1pmvwqp4gAEqQ1O/0Ir5zNFyZEaqpCTFkr1yTNMaok4nwRS1sK4vR2\
                            R+cqg3U0k1o5p8Wmp3cNKKAstQNUSaCIx393KdjdzNbO1ne6E8rFc+3mdOQjhiuq8sMN5wSrvExU\
                            zDLpBnSr09LlMj0nqMdBdNU8cxZCCxDZRjXJaq6JEnwgH45fRfeixYGedlU+d+71PNyUpVUnUnsK\
                            ugadrIj4ftY6jnryzp/sZ0SRKWSlCjTz0NL0MpEpmr7uN6aaWq8hYkoW6N0IR1r/AN9ppqdZJQ+v\
                            tLa2vtrRjrgpfauYyLO6dNSBPTVMlVaicymhJetBRFB7RawDwwW4pUABPogFeXtFhf2h37evNMkM\
                            s0T5P5Ee2vCVvJwpp538fmZOY9ZS8k3IPTVck1HqjdtUoy+a2rTRLT+egOp3BsmkAqKfJRdyIyQK\
                            3Yu0N2vUPuzr1rJLwaqnqVW029U27jmV0n/mM3Ymc2lw5xn3Ncxh4cppPLgC4DDpTtg2yfYIY8vE\
                            mW3z60J5TT5mDdHIl9M6rxvvi+zjqVKT2mtF6iW8gtl9OYGKqw2m9A7qWULi+23ke6qXfnSb5gpn\
                            fFU7SlqSmeaSQNnxX1vsfiK/JTPXZotj943c9PgSUPxcktNWNHVYTTJRbLV9fj5h4JVAM4GrUOK9\
                            aaxSYfuO3SSs648Fcr6j+t0JPNrUt1Ukc8W75OfXw/aCv6SdNBek6skoUmUmXtJelGTqqX5vhxEl\
                            wbUXIsuF6iH8QtP0TMvs/TIaLnLdaNVvofWjTutTV74a6ijqdIkJvx7MMX2CLCtTElHSh+6xzMxv\
                            UaqquQpm64dKY+iTxfdZArQ0dO9td8pI9s75B6f6PZo2p8Lx/wCRsl7mhFkeOOjSlnPT68nNUU2j\
                            +VIJLrilLUt2lOrQcM4qqHVCtHuwRtqxVTlnI3JR1BtmWHVm0reqo/UUvg9glF18JjLLhqYmTJNn\
                            RtmSuCOd2NVPSyXyvEusazySGH7kikxkaNfySOtIwVeG9+27tbqO4muqla+F4/vVJI45SBnIFc5F\
                            8kUUlXDu+rheq0TV0K/Hil2Gx+ogyTVT2Sy3T6WKj81YpkWkHRHl3qZ0r7XINpfLQSFHPK/Pf5pm\
                            aaaRqsjRF1VMn72qN0SQBtpkA8Cz2P7gHSVtqWpVXdGtVW669lQj+dnUzKX8On7E/jIiuRVm2Qrr\
                            Up2Y+Zmp0Vphn0kbhDreUmxO+3I23paHzyi6baA1SwIfpDj/AOiom/apr/mfBpo5TbNH/fKUfoHz\
                            Vq+4+0bCa880k790Ui0CmqmbQp3CJXVb0yhzZfxiDarI3rXlkappa5dLyNRKwl1OR86PtRyZDlnc\
                            /vU0Vv1dWCZCucc1a1FcY6RqX4lNAiVsF/TajSJAJoIoryqNtBQEk0cDNTJ41veq0E+ajVcoLvmf\
                            Yg5Ojckr13ByG3mr/TNSXXT1GzsH+Vn/ANJkhSu43353rmajmWa5ZYqR549bHxvR8Hn7WLF5m2ce\
                            MJYkjjYoEzsQ0eZ6DnwV5Pk8YdKr1p6o3LYQ8E2PbrFFDuNunwUVWp3Uhp53NHP9p5mhnQhr4biz\
                            Brd1jtXRqSrmvXzocbjxFgdbQ/tZXqdx/ahoqb3vbVOtgBVE1KT5MZqSVLKSVKfnWMxdf/2JrRJu\
                            kNeKquhF9pY1LBN730c7jCK2yv2vo+kYSEoxHVtx8llvDtyGSiqiN68HZTS7mZbsRn/2NP607N7j\
                            oZOup5NM8kD+9nNVjl3tZJTUsta08i/FsfZxnB+T2b/HJun+RJ9pYmZPbJVVOijbLpmemOzIjOT+\
                            je4nWg2psSyea0nhB1DNfquIM4fUf2MZUyqMxoUU6WN6ijw4w/igt0UfyTFbiK6GWQKqk2PikoS5\
                            ZdU758SOOYuWV1/2/wDVwalebRXwkk+pARbzPzfAkXL7gXFiewsTy6/pO+sfw/Di9n/XqA5G6OX/\
                            AJuYJgeI8E1y7petS4w7yRVbslJrn2ql66nr0A2zuZ1F0fkaUEsqX+v9zOkp+RPF1j5ufxG25mvy\
                            JzR/ZDM8whkksO+0/Yz1SPZPcdX1XUePfiGGtksc0U4hb73Mz3zE4tLfBYlHcNbGkdTJNQzYuSLY\
                            FL35xXY3GCsF9EE/w6dHXldfody7pksKTkrqGPIqSEdaQal0CEyOmZZ4SUh9aV9nU9H2aOJDc1dN\
                            XtidrrGFhrJWSsr6llUBpoaEus+Xa8za7dJ4NKlf+zqZNY5SCGeb0a3fGMUbajDflSkHBNn1NqQ6\
                            qZmjHjB1Q0WqMU7SqJMcvPTvZP8AMBrzJEEh1upBB11yCyhyVW7ET22zo8vd5KR4sv2LkHsoTfsJ\
                            Ds5GpGq3dO+ipOTf/kfCZyZMbwTzOhnzuNCb8z7OyWo2VLrcgBqeIEqjrvh96oKX3QJ7zJjcoHVq\
                            DNXh3xK8+aCdou0AGmP6vJ14k5x0LvrzMT8Ij6sPIZN+KrHXmgh/S0gOnQP+z1Ns/sE59y4lndky\
                            Lf8AyPkJROnlOu2F9E65OpCY/wAjySppWRHXt6lJ7X5TpmBdr5x7qjpJkrVA1Ube375ssniJ5SnO\
                            nekNH61zUg+vU9eNqMx5olAk2mtM6kuqKJx35P8AGl1Xtq/FKbt5/b7GslVb4a2U114/dHOP8gVp\
                            SmtW2DVamTWp1jetrQTjkyUyQoA/Cv8A7scTtNR5oKZPXdVL1NOuTXTLogDYvPwBlNQnM9/cST4j\
                            oXy2RUh6v2Yx9M49dq45rbOlrc0bqANlJ4aqKSuXnqknF9CuGnTZWyrZ6d1TE84+dkhEzYVqeDIt\
                            djsX3cd17ISDpaez230iMtbJFnuTwb6LmjseeaZBEZfYrSSUHKs0zHLNJPX/ADJrd/AiVWLHKtz1\
                            ipT4gDtRdaE9BjMCn+LrZR0nP7KO3aEWvlr8dVWQ4lGayVzx5n2f47JO+bMjNBNVdrXFAVfit/o2\
                            Ojr+nc5KG+PLikJXRyhqraZB0telarU6yU6SUfy99BeLLhanVTyxpoJ0VfMnXZ+qKmZjqm1lZpIp\
                            RLKQpKFNgt97ajLwGecMXA0FAna6kQrw/V+xl/FFNOPTk80gq9O0WCZV9U21U0kzua3ylicd08ht\
                            roAgRrqBDIZKDW568P460fju/m+YSg1JNlCnH/OO8PFMf9UoGG22r/AMfVfF984Qk49Zannr9GKt\
                            9DWo8VVduTcJMrxT3x/5DFWbVIVjffermHTRP7ryTqmJBF3VTHFZJLH/AJCUorWJuuXZy/k7T/XR\
                            Lbv2JqjHuplma66ltizwR+TJWJr8mo3O9NE6GeIWZxpOtKykdF18ZeIYdK1IGGLJ0DtHOZGQGyVo\
                            g9vTolPg+9iqwliOg2eZ6LGESpHR6E5JtHrZ/Egdf2MDTMO/NV+g8wnJrSiIz6/7BOt898SkZIBL\
                            SLBCelx8Sk0Oyd1V3O6lG6ryMrcHTkmoKEySqA6SpYd115oxsM8x/wBaL0zdT8xM2QMBtPt1semA\
                            l/6stMjcl9zFFh+7j8ITNHHXg1NJp3tealZkNu0JLx09Se/ax5t0U7TaSJOR/wDfYGtH7LjY76op\
                            kPk1ggudNLLVSzT7KCS34qTVf9ES++uvNHwnf46pezbJPmf2sz01Wr/WwGq1xKBTi3QUVRypTlgO\
                            cn1hHDmZs8sdttFDNYckK7lHnW/D7bpTlfPaPhxbmXIgDJMRg8zVST+q9C+jzO2Zph89T48m2d+q\
                            s1+SqdS6dpuTG009qip7m6o3LNlvItUBROVIrdjfhPVNlS2zVnazTM60aOQ0uNTiVRwqlqjGPiMl\
                            POi0c8sfDskVGPFhYSV80hPWiprfnovYdkknPnXKBrZh9XFkF5miZ6J6B1srU6Xxya3o2a8i3qZw\
                            RnF3kqHySz7czyP7VpGZouvMs27BJcdB9e6nmSzdf/zU9dR7USD07SdCmt00guxBUyEaC7pRk0se\
                            kYCagnX95ZtKdVhhj+pjyXK0EiOkhqkcelKKK/o5oAKo011D8NxfVIBHJWmSWwk2ya3UyC6Kq+PQ\
                            uqAqaqZExtz515Z9Hc9MwnnlbUOxPZ10FD0nzrjyXztfE9Hh10734xzX80J6y01P71zPzAS4JYG5\
                            LjROzays9OIVorlUOKU+WENMn1x/rg0Or6qWckyc7deFreTU0aTby2J3+t9ZklKlOqp7nrvzP6gm\
                            qdKM2D4dgUr8U/mzhMpQyFLvHUNCApW6omjqqdaKHyj0Zi+3cAVBU7JxlU+y7e6g6xtz0nWiqV5d\
                            WGTeTFnrjott+sKT2ITlitKW10h9hxUxo8m9Kf3VhXswm6dBr0s3zPncfN89/Tz3XFSLY+cnMSV5\
                            WD9SwPmuq5rqWadXBO+AJDAqNJdhfstmEGZlFncVX6f0j6ORypc3KxSOpstqr47ZZkkxqZ+o3DCM\
                            aKhWP12pxzTk3Esw1z7BSPpMxoua9jmePx+6clRErH+SllZdbRdT4BgJnWhJ5bJYKuV/IG1VhP3z\
                            U1FWHqzJTdVNUpXPtVdSpdzNNJ3vX45+dAlR2qfCJyDCOSzI6hQqG9KZ/sWGO6kK/JfKxc5JtOah\
                            NZDkitzcaNps1oqKqvhOPjc3NbicYMWDPDQzUIb8PMk7LLRES+pmPtvB+RJaSJqISakdM31zqmiq\
                            i7bqF1LaFSxwf5GecY5KGQpqmWmv63DuQ7m2amtQtOQ3NI4gGw1z38RlmFC5TUdHQ2yNYpfrOarm\
                            guZHlsuVqfLvT14Cpvfcba8Emro4vJzyTXIcae+thyVTpdAa2u56rdAEqj6/3cahsmhoeWScrSv/\
                            AKSiJT417lPXn2YxmkCdWak6L2KdPrM0TWj8dyjwvAkc0V8nhFASOZalunXaATkIsoZlQlaI4CaB\
                            XHOCYq9nM09qGynxo3yM1CKczt11SM0tynx9nKWoX515JK8LKissT+nwLt6daXS2PsY6ZB3+MdKf\
                            1SdS708MnlRyVp1Tsn4y+tmjcS7ev5VGV/HO5Onx/J678y70rucJZhSbtu+SULWJwyyjvl884Y4f\
                            spRjdzNe863T+w3KhuelDSJvXOqVbfXzVyVUJVdVRNbrRW09TpndeDTenWiWviqKiq46VSaqSKTZ\
                            W6Z5rdPlrhtoNGiYvlziSZn/AF/vQafFb1ksXl/GJP8ALW+f3cpIBkmLkqBucU7xcxh4shUBroiY\
                            9fqsG4furRWuSoda37SPUal9FWamnQyP6xtPwvD9r2/t8eaErlkJNBMzVDrW6Ui7qzU8zIsM0Awd\
                            8s1UvP8A+NpaadWysvGOStNvQzLR2xzE1PcRuMiNdPjcbn1Q5eK0QvmMhJfTPSRMAAC7K42Qadup\
                            hWQ2IouujWudswyx/bx9k0uyyE3tTQUpMtUlVO3Lzo6F0TNnHGTd0zZGUqKySlyaYqxTcqXk74pM\
                            k0tCXm2mjHisQykPlZdVce0GSdtWVZXskpEzRBPOSdsvr/Xza32Y91s0nTHldxSiyWNQDqpq6WNf\
                            DzBGBJTK/pGwB1Q8tiQj82pdeXskUf1Xm1dA1X87DpVH+EXYAPrSAHWpd8BwzUfknnQlS9bKl2bQ\
                            2KE3Xvmmhjpo1XU75lAYgkhLcSUYFvpS2uRf9+pe3fIPj88cOWJr+8j7aKmNzREx+PQLSWtfrHOi\
                            cUs0Bp39b7UFQn5H/U1DkAnIyxU7U9UxjxMS1HNOtZDIQsZcgAzlobxou6oGpLkadr4qmCt76h5l\
                            EaRmynFNr0jUs304+Yok2qP7Zj8ZWNZrqzxVhkDAkdpsp6teADiA8wZMUZ7DG9MRYXmx5o9VHom/\
                            ZholK0RLMpscZ3MnTZcTCtlfVqvWnJJpN8qk09VunkqfB4aE33upfk5jand1luiuAxM+2Siu26ni\
                            sn5XKCDdEkz6uXbJ2HMSb6qg6dkztu6Mk3PqPW/B5qpambUOhXSm70z8NWNLKXQ3y9nGiu3LEWeH\
                            LEY6ayesu0j8rE+N8m56yMoM3E+KOYkqZAxyZadzdVN/kdY2vKEVN6x62KaoJ6N1pNXuPx5suRqT\
                            GtFO8dc1uhrXTO5kZv8AQu4/VZLg2zjJkx3N2H45ZuXxlSZkPSkxgx26AKceuf8AU8zBIVCoo7op\
                            5ozF1vFiUh1BOq130z2KOcn2McUy3ZOi58DM0tbEm1f068y8OvaTpz9b7Ng6bbrfr5DZwKseep/Z\
                            NFa6Z8exM9H2t0TVS261vRxLZd6NJyVEL7TP/N8tblg50SijtWRlDXLv1p3FUDf9CbbiJ1VJQATF\
                            6+5U87RBExLhbUHr9/TVX1vu2y11U42pmuBPIzK3QM0FTPlnUzjluRQl99f/ACPVEz1qaOsYNIGq\
                            h6jRual8rJzFUlbH5F/WyX+LHN1OuFrvlpIyEbLeZdSap8TTaXMB8dYMsm18dPU/2D4mFkUYo8yS\
                            cavXga2nEC3F1SzN8KcMQBE8IBHl2ZOjViwxfe9q6VRvqoDcz3GplqvZ2arrk5I3t1yZj+3jWTqq\
                            KqGn9Bqdw9c0unXU1UzdCrzbLMYvs400k6PJU5Ct68DPIb/rVXLQ1f72CM8dfXy81NpUmTrwcFzf\
                            Btp3Jwj6OTVK/loMY6oY3c5IRA42d6XikA/yB71HRPUVD7F9yZi1yVuUpZmlXH46iWNaoSZjC132\
                            vLVY6ttH3IELpn2rU3F+Kjk3t4d9Tc936ulx9QyxJxjn8hTR617C9ytQTtm/aOVo6gxlLuup7qSe\
                            SKNUnOp21qen9Eu02+sE2GnhnfQ0qQHHR8d3YVjJKbkb8sc4tY/yMxJyOQkkoOna/jAoF8k1VVFP\
                            UEBy3XXzfJfBgy5Im5qgJ3V99eKkr10oRVOp4ploA7Vn5vnJJyVoqZyMY+FqDHQDwkCl+enSp7D/\
                            AJ14P8t1jrcptmHbaq2TNzEhRjHlLZucUy5rpjGJS/V+9ur11Qa5n3kJJ7qvWTaHft0yy8Ve6tf5\
                            r9D750f/ADMOQIp3f+wokyOW6C6/LMuJxX200xqmt1Nh9L7NEs64sncP+zUtUMVLWOybMZIs9s8Q\
                            0U5FrqhBD7qPodqroh80plCSgIypyVP6kXv1vtxbKzOSK9itJXSwdQNfjdzMDVEjvWO2a9GR9rFQ\
                            9S5Gnk6qG663JuDoZh4buhk0tzIXuR+p9j620pnFanLIWPlMmpr1xk2LX48j/Mq1PkoMGXBeOQto\
                            eimdlRQzSWaZ3Qz+qcdTcOIjqCXugXvnFSzykgEFfT2J5s0UGB+uPWoGiMhrh1q3prHLdx2FWw1O\
                            SfWvxz3PZ+4bIbdbmqcQU4gcczzDQ1ubLm9WG9N4/L8QTqTc56xyu3Fw1NRE1M48vhJOcf5Jmd0V\
                            pa2VjTFyFfuJECcYPORolfM9epONqOaPFSsFSfAhDStxq76HPWKBCoJyEVsDkcotHe0UH+Px48lN\
                            RnxZKnsApyWVF8aolOWGWXao3Q6vxdH9X6M5FS3Vc8kvryFXdxUB3eoa5jrbDT/SMj9WM8ZidkYz\
                            IRK5bGi4nJja3Iy9LJNqZGu/MFq8M/2cfCn/ALPtjLukhlZWZ36Y/XdR1kx0FsEZDITAGxO2qeoA\
                            u1oVKESzBvdRc6l1RvSqxf47JMlP6301CIYyzqq/Q8wPr2Y1iC0pQ+b+t9gQCq9ZT28KHNFEuhdq\
                            ankutZOfWgP6/wB3ORXU2OTV82VuU1v/ALKaJnjW6l6tTVD8YYfvZNU1JXHoeQ5rrH7RXW+lE4s1\
                            c3PtipbqDKFvKtLioGdzU2e0VKfEdRKTyuiJ6lfWOn1MWbHUFeMjFFzVFXTFQegTEcgzVOjnIlb4\
                            fx03jNU44qIvhmQLh2bm0tX2mqNFFHQ3vXi6BPrfe41NC+wM1wlGnvXNUnLXKXZfUqN6m0yftfX3\
                            OzQjR+Qdamnp6rwzK66RevFJ4SgJQCAddaNZbghLxlmYmW1tU7+GMER9nS6Q/wDOKuhl41ikTxT3\
                            cgs4/FLotkovF9kqqPOmtAvJzUj6uq6Av+PDtNWaJeU5PrNv+wmWNkzMm/41W3G1uZKkP1T1LNjj\
                            fnq5wY5msdm5MegqaZlWp010z/XINLqXbTyuAIuCG+PinJhaZiFHlmBOhRW7VtYc4fs2HrMnVTdI\
                            UrHq3UEVD3wVjWqit7tjkYvfEuHC5Sf92Sfx1jCdd8JSKSTidcuqv2j/AK2Vub3wdXb+yrVb6pgJ\
                            XoBLKgKdbtnbrtH5f/S+7jaTGpA0ezBITVrklXT0sFRTNdWqSq5LLD92L/FP5Y3hrr844rN2VGNx\
                            dSkVbQDPrE1mdpEze+b50mmJfYHVxXvEeYSSqa/4k81lHyYoMWWvyAZK7qZqqabx1vn8k3Ccnp+M\
                            jGs+K6BNzD3D9wKmxSf9cv4+a0ZKm6fHjJP90ITNzOsdQ2vzfN8mUkhTn6ikDDHrVjo9If8A1/tW\
                            Ky3PLLF9t2tkEnrKOMnXfLMtNXooGmuD7dvtN0NzPFs8rNMWbnXOpI5n8kVZ7Le3JLvm+XY6BtHE\
                            UgAG5+Psw9+r/kLQxtITrnUnrKGNmV1BSkrK754p0agbT93JQ8tzT0kuSjxUbtHE3+6Cd9ddUoUQ\
                            183zfCNYbn4+4e/WytRG6rIXjopDHqU/db2VTqvUXI3j9rVCvjP632pvHi5Apia58NQ1J/fN37TN\
                            csnUeKmW5eY3zfC4GhPQj7iRWa7j2B7+4Z4ub9y9DVDyk1SJG4DcB/8A5WwqutU9HVqHzFJvzkW5\
                            2PpQWyIcw75fyhqaUnknfN8x2FR6kd8hFykghLkLHXDFVQmVqMaj4opWtSamqSulR8STray6WGPU\
                            DjaGb0ULVQyzW/8A9hKVoJkWGHwi13vm+EoCDULU986xjPMfS2E+rx7jJ9hoPUx8SeUrTsU9Xav7\
                            pSd1s7mb4nfN83xTcc9vqmCYBOSqoxIpVEr07KR//9k=\
                            ","http://www.nbdeli.com/formwork/default/images/case-li-img.jpg","data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB\
                            AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEB\
                            AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAB4AHgDASIA\
                            AhEBAxEB/8QAHQAAAwEBAQADAQAAAAAAAAAABAUGAAMCAQgJB//EACkQAQEAAwACAgMAAwEBAAID\
                            AAECAxESISIABBMxMgUjQkEUM0NRUnH/xAAZAQEBAQEBAQAAAAAAAAAAAAABAgADBAX/xAAtEQAB\
                            AgUCBAYDAAMAAAAAAAABESEAAjFBUWFxEoGR8AMiobHB0RPh8TJCYv/aAAwDAQACEQMRAD8A+7+L\
                            D+NP/wAXiWmiSVt1bN6MiTVVPsamYqiROUYElYo0Gx3Lc45Z2H7kl6P6uv41e/HrUkZ9X7X3cX+y\
                            /wB0l/jT+EEceNDHkpNVkepdBW5JEGOP7X3cjIkPnVljEPjV1MtXUq5B53qpYfya9j4QmF1PNbq5\
                            yH9jHt/FMocIzqhdGR3eKfFQyPI6pSqalqZp94dz69Uk+bKll2RkgDseR2u5DquaSZ/naS98rzvU\
                            HjdtBzpfkrj+x9qGULqQKqmSf9kOTitTuadkXWN3pfbGUaCY+x9zJzzV9TU70zDerHlvlDkdpsZ/\
                            dDQM7iKZIL7BEK7tQ/e/EWUgDcB8V/ekVUfY59tp4NdvgeQ2Psk+JrY8/upPJroZXGS/rVSdp663\
                            M1L/ANjybnferXdeObksmT7uIlnVacfjpXxaTRqql1S7va0b6K705+x93y87Z0pPUFH6iJojdDUy\
                            rVjO6vrxEM/kMqMS9XOGX+1pmvwqp4gAEqQ1O/0Ir5zNFyZEaqpCTFkr1yTNMaok4nwRS1sK4vR2\
                            R+cqg3U0k1o5p8Wmp3cNKKAstQNUSaCIx393KdjdzNbO1ne6E8rFc+3mdOQjhiuq8sMN5wSrvExU\
                            zDLpBnSr09LlMj0nqMdBdNU8cxZCCxDZRjXJaq6JEnwgH45fRfeixYGedlU+d+71PNyUpVUnUnsK\
                            ugadrIj4ftY6jnryzp/sZ0SRKWSlCjTz0NL0MpEpmr7uN6aaWq8hYkoW6N0IR1r/AN9ppqdZJQ+v\
                            tLa2vtrRjrgpfauYyLO6dNSBPTVMlVaicymhJetBRFB7RawDwwW4pUABPogFeXtFhf2h37evNMkM\
                            s0T5P5Ee2vCVvJwpp538fmZOY9ZS8k3IPTVck1HqjdtUoy+a2rTRLT+egOp3BsmkAqKfJRdyIyQK\
                            3Yu0N2vUPuzr1rJLwaqnqVW029U27jmV0n/mM3Ymc2lw5xn3Ncxh4cppPLgC4DDpTtg2yfYIY8vE\
                            mW3z60J5TT5mDdHIl9M6rxvvi+zjqVKT2mtF6iW8gtl9OYGKqw2m9A7qWULi+23ke6qXfnSb5gpn\
                            fFU7SlqSmeaSQNnxX1vsfiK/JTPXZotj943c9PgSUPxcktNWNHVYTTJRbLV9fj5h4JVAM4GrUOK9\
                            aaxSYfuO3SSs648Fcr6j+t0JPNrUt1Ukc8W75OfXw/aCv6SdNBek6skoUmUmXtJelGTqqX5vhxEl\
                            wbUXIsuF6iH8QtP0TMvs/TIaLnLdaNVvofWjTutTV74a6ijqdIkJvx7MMX2CLCtTElHSh+6xzMxv\
                            UaqquQpm64dKY+iTxfdZArQ0dO9td8pI9s75B6f6PZo2p8Lx/wCRsl7mhFkeOOjSlnPT68nNUU2j\
                            +VIJLrilLUt2lOrQcM4qqHVCtHuwRtqxVTlnI3JR1BtmWHVm0reqo/UUvg9glF18JjLLhqYmTJNn\
                            RtmSuCOd2NVPSyXyvEusazySGH7kikxkaNfySOtIwVeG9+27tbqO4muqla+F4/vVJI45SBnIFc5F\
                            8kUUlXDu+rheq0TV0K/Hil2Gx+ogyTVT2Sy3T6WKj81YpkWkHRHl3qZ0r7XINpfLQSFHPK/Pf5pm\
                            aaaRqsjRF1VMn72qN0SQBtpkA8Cz2P7gHSVtqWpVXdGtVW669lQj+dnUzKX8On7E/jIiuRVm2Qrr\
                            Up2Y+Zmp0Vphn0kbhDreUmxO+3I23paHzyi6baA1SwIfpDj/AOiom/apr/mfBpo5TbNH/fKUfoHz\
                            Vq+4+0bCa880k790Ui0CmqmbQp3CJXVb0yhzZfxiDarI3rXlkappa5dLyNRKwl1OR86PtRyZDlnc\
                            /vU0Vv1dWCZCucc1a1FcY6RqX4lNAiVsF/TajSJAJoIoryqNtBQEk0cDNTJ41veq0E+ajVcoLvmf\
                            Yg5Ojckr13ByG3mr/TNSXXT1GzsH+Vn/ANJkhSu43353rmajmWa5ZYqR549bHxvR8Hn7WLF5m2ce\
                            MJYkjjYoEzsQ0eZ6DnwV5Pk8YdKr1p6o3LYQ8E2PbrFFDuNunwUVWp3Uhp53NHP9p5mhnQhr4biz\
                            Brd1jtXRqSrmvXzocbjxFgdbQ/tZXqdx/ahoqb3vbVOtgBVE1KT5MZqSVLKSVKfnWMxdf/2JrRJu\
                            kNeKquhF9pY1LBN730c7jCK2yv2vo+kYSEoxHVtx8llvDtyGSiqiN68HZTS7mZbsRn/2NP607N7j\
                            oZOup5NM8kD+9nNVjl3tZJTUsta08i/FsfZxnB+T2b/HJun+RJ9pYmZPbJVVOijbLpmemOzIjOT+\
                            je4nWg2psSyea0nhB1DNfquIM4fUf2MZUyqMxoUU6WN6ijw4w/igt0UfyTFbiK6GWQKqk2PikoS5\
                            ZdU758SOOYuWV1/2/wDVwalebRXwkk+pARbzPzfAkXL7gXFiewsTy6/pO+sfw/Di9n/XqA5G6OX/\
                            AJuYJgeI8E1y7petS4w7yRVbslJrn2ql66nr0A2zuZ1F0fkaUEsqX+v9zOkp+RPF1j5ufxG25mvy\
                            JzR/ZDM8whkksO+0/Yz1SPZPcdX1XUePfiGGtksc0U4hb73Mz3zE4tLfBYlHcNbGkdTJNQzYuSLY\
                            FL35xXY3GCsF9EE/w6dHXldfody7pksKTkrqGPIqSEdaQal0CEyOmZZ4SUh9aV9nU9H2aOJDc1dN\
                            XtidrrGFhrJWSsr6llUBpoaEus+Xa8za7dJ4NKlf+zqZNY5SCGeb0a3fGMUbajDflSkHBNn1NqQ6\
                            qZmjHjB1Q0WqMU7SqJMcvPTvZP8AMBrzJEEh1upBB11yCyhyVW7ET22zo8vd5KR4sv2LkHsoTfsJ\
                            Ds5GpGq3dO+ipOTf/kfCZyZMbwTzOhnzuNCb8z7OyWo2VLrcgBqeIEqjrvh96oKX3QJ7zJjcoHVq\
                            DNXh3xK8+aCdou0AGmP6vJ14k5x0LvrzMT8Ij6sPIZN+KrHXmgh/S0gOnQP+z1Ns/sE59y4lndky\
                            Lf8AyPkJROnlOu2F9E65OpCY/wAjySppWRHXt6lJ7X5TpmBdr5x7qjpJkrVA1Ube375ssniJ5SnO\
                            nekNH61zUg+vU9eNqMx5olAk2mtM6kuqKJx35P8AGl1Xtq/FKbt5/b7GslVb4a2U114/dHOP8gVp\
                            SmtW2DVamTWp1jetrQTjkyUyQoA/Cv8A7scTtNR5oKZPXdVL1NOuTXTLogDYvPwBlNQnM9/cST4j\
                            oXy2RUh6v2Yx9M49dq45rbOlrc0bqANlJ4aqKSuXnqknF9CuGnTZWyrZ6d1TE84+dkhEzYVqeDIt\
                            djsX3cd17ISDpaez230iMtbJFnuTwb6LmjseeaZBEZfYrSSUHKs0zHLNJPX/ADJrd/AiVWLHKtz1\
                            ipT4gDtRdaE9BjMCn+LrZR0nP7KO3aEWvlr8dVWQ4lGayVzx5n2f47JO+bMjNBNVdrXFAVfit/o2\
                            Ojr+nc5KG+PLikJXRyhqraZB0telarU6yU6SUfy99BeLLhanVTyxpoJ0VfMnXZ+qKmZjqm1lZpIp\
                            RLKQpKFNgt97ajLwGecMXA0FAna6kQrw/V+xl/FFNOPTk80gq9O0WCZV9U21U0kzua3ylicd08ht\
                            roAgRrqBDIZKDW568P460fju/m+YSg1JNlCnH/OO8PFMf9UoGG22r/AMfVfF984Qk49Zannr9GKt\
                            9DWo8VVduTcJMrxT3x/5DFWbVIVjffermHTRP7ryTqmJBF3VTHFZJLH/AJCUorWJuuXZy/k7T/XR\
                            Lbv2JqjHuplma66ltizwR+TJWJr8mo3O9NE6GeIWZxpOtKykdF18ZeIYdK1IGGLJ0DtHOZGQGyVo\
                            g9vTolPg+9iqwliOg2eZ6LGESpHR6E5JtHrZ/Egdf2MDTMO/NV+g8wnJrSiIz6/7BOt898SkZIBL\
                            SLBCelx8Sk0Oyd1V3O6lG6ryMrcHTkmoKEySqA6SpYd115oxsM8x/wBaL0zdT8xM2QMBtPt1semA\
                            l/6stMjcl9zFFh+7j8ITNHHXg1NJp3tealZkNu0JLx09Se/ax5t0U7TaSJOR/wDfYGtH7LjY76op\
                            kPk1ggudNLLVSzT7KCS34qTVf9ES++uvNHwnf46pezbJPmf2sz01Wr/WwGq1xKBTi3QUVRypTlgO\
                            cn1hHDmZs8sdttFDNYckK7lHnW/D7bpTlfPaPhxbmXIgDJMRg8zVST+q9C+jzO2Zph89T48m2d+q\
                            s1+SqdS6dpuTG009qip7m6o3LNlvItUBROVIrdjfhPVNlS2zVnazTM60aOQ0uNTiVRwqlqjGPiMl\
                            POi0c8sfDskVGPFhYSV80hPWiprfnovYdkknPnXKBrZh9XFkF5miZ6J6B1srU6Xxya3o2a8i3qZw\
                            RnF3kqHySz7czyP7VpGZouvMs27BJcdB9e6nmSzdf/zU9dR7USD07SdCmt00guxBUyEaC7pRk0se\
                            kYCagnX95ZtKdVhhj+pjyXK0EiOkhqkcelKKK/o5oAKo011D8NxfVIBHJWmSWwk2ya3UyC6Kq+PQ\
                            uqAqaqZExtz515Z9Hc9MwnnlbUOxPZ10FD0nzrjyXztfE9Hh10734xzX80J6y01P71zPzAS4JYG5\
                            LjROzays9OIVorlUOKU+WENMn1x/rg0Or6qWckyc7deFreTU0aTby2J3+t9ZklKlOqp7nrvzP6gm\
                            qdKM2D4dgUr8U/mzhMpQyFLvHUNCApW6omjqqdaKHyj0Zi+3cAVBU7JxlU+y7e6g6xtz0nWiqV5d\
                            WGTeTFnrjott+sKT2ITlitKW10h9hxUxo8m9Kf3VhXswm6dBr0s3zPncfN89/Tz3XFSLY+cnMSV5\
                            WD9SwPmuq5rqWadXBO+AJDAqNJdhfstmEGZlFncVX6f0j6ORypc3KxSOpstqr47ZZkkxqZ+o3DCM\
                            aKhWP12pxzTk3Esw1z7BSPpMxoua9jmePx+6clRErH+SllZdbRdT4BgJnWhJ5bJYKuV/IG1VhP3z\
                            U1FWHqzJTdVNUpXPtVdSpdzNNJ3vX45+dAlR2qfCJyDCOSzI6hQqG9KZ/sWGO6kK/JfKxc5JtOah\
                            NZDkitzcaNps1oqKqvhOPjc3NbicYMWDPDQzUIb8PMk7LLRES+pmPtvB+RJaSJqISakdM31zqmiq\
                            i7bqF1LaFSxwf5GecY5KGQpqmWmv63DuQ7m2amtQtOQ3NI4gGw1z38RlmFC5TUdHQ2yNYpfrOarm\
                            guZHlsuVqfLvT14Cpvfcba8Emro4vJzyTXIcae+thyVTpdAa2u56rdAEqj6/3cahsmhoeWScrSv/\
                            AKSiJT417lPXn2YxmkCdWak6L2KdPrM0TWj8dyjwvAkc0V8nhFASOZalunXaATkIsoZlQlaI4CaB\
                            XHOCYq9nM09qGynxo3yM1CKczt11SM0tynx9nKWoX515JK8LKissT+nwLt6daXS2PsY6ZB3+MdKf\
                            1SdS708MnlRyVp1Tsn4y+tmjcS7ev5VGV/HO5Onx/J678y70rucJZhSbtu+SULWJwyyjvl884Y4f\
                            spRjdzNe863T+w3KhuelDSJvXOqVbfXzVyVUJVdVRNbrRW09TpndeDTenWiWviqKiq46VSaqSKTZ\
                            W6Z5rdPlrhtoNGiYvlziSZn/AF/vQafFb1ksXl/GJP8ALW+f3cpIBkmLkqBucU7xcxh4shUBroiY\
                            9fqsG4furRWuSoda37SPUal9FWamnQyP6xtPwvD9r2/t8eaErlkJNBMzVDrW6Ui7qzU8zIsM0Awd\
                            8s1UvP8A+NpaadWysvGOStNvQzLR2xzE1PcRuMiNdPjcbn1Q5eK0QvmMhJfTPSRMAAC7K42Qadup\
                            hWQ2IouujWudswyx/bx9k0uyyE3tTQUpMtUlVO3Lzo6F0TNnHGTd0zZGUqKySlyaYqxTcqXk74pM\
                            k0tCXm2mjHisQykPlZdVce0GSdtWVZXskpEzRBPOSdsvr/Xza32Y91s0nTHldxSiyWNQDqpq6WNf\
                            DzBGBJTK/pGwB1Q8tiQj82pdeXskUf1Xm1dA1X87DpVH+EXYAPrSAHWpd8BwzUfknnQlS9bKl2bQ\
                            2KE3Xvmmhjpo1XU75lAYgkhLcSUYFvpS2uRf9+pe3fIPj88cOWJr+8j7aKmNzREx+PQLSWtfrHOi\
                            cUs0Bp39b7UFQn5H/U1DkAnIyxU7U9UxjxMS1HNOtZDIQsZcgAzlobxou6oGpLkadr4qmCt76h5l\
                            EaRmynFNr0jUs304+Yok2qP7Zj8ZWNZrqzxVhkDAkdpsp6teADiA8wZMUZ7DG9MRYXmx5o9VHom/\
                            ZholK0RLMpscZ3MnTZcTCtlfVqvWnJJpN8qk09VunkqfB4aE33upfk5jand1luiuAxM+2Siu26ni\
                            sn5XKCDdEkz6uXbJ2HMSb6qg6dkztu6Mk3PqPW/B5qpambUOhXSm70z8NWNLKXQ3y9nGiu3LEWeH\
                            LEY6ayesu0j8rE+N8m56yMoM3E+KOYkqZAxyZadzdVN/kdY2vKEVN6x62KaoJ6N1pNXuPx5suRqT\
                            GtFO8dc1uhrXTO5kZv8AQu4/VZLg2zjJkx3N2H45ZuXxlSZkPSkxgx26AKceuf8AU8zBIVCoo7op\
                            5ozF1vFiUh1BOq130z2KOcn2McUy3ZOi58DM0tbEm1f068y8OvaTpz9b7Ng6bbrfr5DZwKseep/Z\
                            NFa6Z8exM9H2t0TVS261vRxLZd6NJyVEL7TP/N8tblg50SijtWRlDXLv1p3FUDf9CbbiJ1VJQATF\
                            6+5U87RBExLhbUHr9/TVX1vu2y11U42pmuBPIzK3QM0FTPlnUzjluRQl99f/ACPVEz1qaOsYNIGq\
                            h6jRual8rJzFUlbH5F/WyX+LHN1OuFrvlpIyEbLeZdSap8TTaXMB8dYMsm18dPU/2D4mFkUYo8yS\
                            cavXga2nEC3F1SzN8KcMQBE8IBHl2ZOjViwxfe9q6VRvqoDcz3GplqvZ2arrk5I3t1yZj+3jWTqq\
                            KqGn9Bqdw9c0unXU1UzdCrzbLMYvs400k6PJU5Ct68DPIb/rVXLQ1f72CM8dfXy81NpUmTrwcFzf\
                            Btp3Jwj6OTVK/loMY6oY3c5IRA42d6XikA/yB71HRPUVD7F9yZi1yVuUpZmlXH46iWNaoSZjC132\
                            vLVY6ttH3IELpn2rU3F+Kjk3t4d9Tc936ulx9QyxJxjn8hTR617C9ytQTtm/aOVo6gxlLuup7qSe\
                            SKNUnOp21qen9Eu02+sE2GnhnfQ0qQHHR8d3YVjJKbkb8sc4tY/yMxJyOQkkoOna/jAoF8k1VVFP\
                            UEBy3XXzfJfBgy5Im5qgJ3V99eKkr10oRVOp4ploA7Vn5vnJJyVoqZyMY+FqDHQDwkCl+enSp7D/\
                            AJ14P8t1jrcptmHbaq2TNzEhRjHlLZucUy5rpjGJS/V+9ur11Qa5n3kJJ7qvWTaHft0yy8Ve6tf5\
                            r9D750f/ADMOQIp3f+wokyOW6C6/LMuJxX200xqmt1Nh9L7NEs64sncP+zUtUMVLWOybMZIs9s8Q\
                            0U5FrqhBD7qPodqroh80plCSgIypyVP6kXv1vtxbKzOSK9itJXSwdQNfjdzMDVEjvWO2a9GR9rFQ\
                            9S5Gnk6qG663JuDoZh4buhk0tzIXuR+p9j620pnFanLIWPlMmpr1xk2LX48j/Mq1PkoMGXBeOQto\
                            eimdlRQzSWaZ3Qz+qcdTcOIjqCXugXvnFSzykgEFfT2J5s0UGB+uPWoGiMhrh1q3prHLdx2FWw1O\
                            SfWvxz3PZ+4bIbdbmqcQU4gcczzDQ1ubLm9WG9N4/L8QTqTc56xyu3Fw1NRE1M48vhJOcf5Jmd0V\
                            pa2VjTFyFfuJECcYPORolfM9epONqOaPFSsFSfAhDStxq76HPWKBCoJyEVsDkcotHe0UH+Px48lN\
                            RnxZKnsApyWVF8aolOWGWXao3Q6vxdH9X6M5FS3Vc8kvryFXdxUB3eoa5jrbDT/SMj9WM8ZidkYz\
                            IRK5bGi4nJja3Iy9LJNqZGu/MFq8M/2cfCn/ALPtjLukhlZWZ36Y/XdR1kx0FsEZDITAGxO2qeoA\
                            u1oVKESzBvdRc6l1RvSqxf47JMlP6301CIYyzqq/Q8wPr2Y1iC0pQ+b+t9gQCq9ZT28KHNFEuhdq\
                            ankutZOfWgP6/wB3ORXU2OTV82VuU1v/ALKaJnjW6l6tTVD8YYfvZNU1JXHoeQ5rrH7RXW+lE4s1\
                            c3PtipbqDKFvKtLioGdzU2e0VKfEdRKTyuiJ6lfWOn1MWbHUFeMjFFzVFXTFQegTEcgzVOjnIlb4\
                            fx03jNU44qIvhmQLh2bm0tX2mqNFFHQ3vXi6BPrfe41NC+wM1wlGnvXNUnLXKXZfUqN6m0yftfX3\
                            OzQjR+Qdamnp6rwzK66RevFJ4SgJQCAddaNZbghLxlmYmW1tU7+GMER9nS6Q/wDOKuhl41ikTxT3\
                            cgs4/FLotkovF9kqqPOmtAvJzUj6uq6Av+PDtNWaJeU5PrNv+wmWNkzMm/41W3G1uZKkP1T1LNjj\
                            fnq5wY5msdm5MegqaZlWp010z/XINLqXbTyuAIuCG+PinJhaZiFHlmBOhRW7VtYc4fs2HrMnVTdI\
                            UrHq3UEVD3wVjWqit7tjkYvfEuHC5Sf92Sfx1jCdd8JSKSTidcuqv2j/AK2Vub3wdXb+yrVb6pgJ\
                            XoBLKgKdbtnbrtH5f/S+7jaTGpA0ezBITVrklXT0sFRTNdWqSq5LLD92L/FP5Y3hrr844rN2VGNx\
                            dSkVbQDPrE1mdpEze+b50mmJfYHVxXvEeYSSqa/4k81lHyYoMWWvyAZK7qZqqabx1vn8k3Ccnp+M\
                            jGs+K6BNzD3D9wKmxSf9cv4+a0ZKm6fHjJP90ITNzOsdQ2vzfN8mUkhTn6ikDDHrVjo9If8A1/tW\
                            Ky3PLLF9t2tkEnrKOMnXfLMtNXooGmuD7dvtN0NzPFs8rNMWbnXOpI5n8kVZ7Le3JLvm+XY6BtHE\
                            UgAG5+Psw9+r/kLQxtITrnUnrKGNmV1BSkrK754p0agbT93JQ8tzT0kuSjxUbtHE3+6Cd9ddUoUQ\
                            183zfCNYbn4+4e/WytRG6rIXjopDHqU/db2VTqvUXI3j9rVCvjP632pvHi5Apia58NQ1J/fN37TN\
                            csnUeKmW5eY3zfC4GhPQj7iRWa7j2B7+4Z4ub9y9DVDyk1SJG4DcB/8A5WwqutU9HVqHzFJvzkW5\
                            2PpQWyIcw75fyhqaUnknfN8x2FR6kd8hFykghLkLHXDFVQmVqMaj4opWtSamqSulR8STray6WGPU\
                            DjaGb0ULVQyzW/8A9hKVoJkWGHwi13vm+EoCDULU986xjPMfS2E+rx7jJ9hoPUx8SeUrTsU9Xav7\
                            pSd1s7mb4nfN83xTcc9vqmCYBOSqoxIpVEr07KR//9k=\
                            ","http://www.nbdeli.com/formwork/default/images/case-li-img.jpg","http://www.nbdeli.com/formwork/default/images/case-li-img4.jpg","http://www.nbdeli.com/formwork/default/images/case-li-img3.jpg"]
                        }, function(data) {}, function(resp) {});
                        break;
                    case "file":
                        deli.common.file.upload({
                        }, function(data) {}, function(resp) {});
                        break;
                    case "open":
                        deli.common.location.open({  
                            "latitude": "30.50",
                            "longitude": "114.33",
                            "name": "武汉市",
                            "address": "武汉市洪山区",
                            "scale": "18"
                        }, function(data) {}, function(resp) {});
                        break;
                    case "get":
                        deli.common.location.get({}, function(data) {
                            alert(JSON.stringify(data));
                        }, function(resp) {
                            alert(JSON.stringify(resp));
                        });
                        break;
                    case "share":
                        deli.common.message.share(shareConfig, function(data) {}, function(resp) {});
                        break;
                    case "vibrate":
                        deli.common.phone.vibrate({}, function(data) {}, function(resp) {});
                        break;
                    case "getNetworkType":
                        deli.common.connection.getNetworkType({}, function(data) {
                            alert(JSON.stringify(data));
                        },function(resp){
                            alert(JSON.stringify(resp));
                        });
                        break;
                    case "getUUID":
                        deli.common.phone.getUUID({}, function(data) {
                            alert(JSON.stringify(data));
                        }, function(resp) {
                            alert(JSON.stringify(resp));
                        });
                        break;
                    case "getInterface":
                        deli.common.phone.getInterface({}, function(data) {
                            alert(JSON.stringify(data));
                        }, function(resp) {
                            alert(JSON.stringify(resp));
                        });
                        break;
                    case "bind":
                        deli.app.device.bind({}, function(data) {}, function(resp) {});
                        break;
                    case "session.get":
                        deli.app.session.get({"user_id":"355669228033933312"},function(data){
                            alert(JSON.stringify(data));
                        },function(resp){
                            alert(JSON.stringify(resp));
                        });
                        break;
                    case "user.get":
                        deli.app.user.get({"user_id":""},function(data){
                            alert(JSON.stringify(data));
                        },function(resp){
                            alert(JSON.stringify(resp));
                        });
                        break;
                    case "organization.get":
                        deli.app.organization.get({"org_id":""},function(data){
                            alert(JSON.stringify(data));
                        },function(resp){
                            alert(JSON.stringify(resp));
                        });
                        break;
                    case "telephoneCall":
                        deli.app.user.telephoneCall({
                            "user_id": "355672617635545088"
                        }, function(data) {}, function(resp) {});
                        break;
                    case "chatOpen":
                        deli.app.user.chatOpen({
                            "type":"single",
                            "chat_id": "d80822b2429448e9e60e3a0f9b1c7eaa"
                        }, function(data) {}, function(resp) {});
                        break;
                    case "user":
                        deli.app.user.select({
                            "id":"355671868335718400",
                            "name": "可选人员",
                            "mode": "multi", //多选
                            "root_dept_id": "355671868335718401", //设置可选顶级部门的Id
                            "max": 200, //选择人数限制
                            "user_ids": ["355672617635545088", "362618666346348544"],
                            //已选的用户
                            "disabled_user_ids": ["355672596013907968", "360009358211284992"]
                        }, function(data) {
                            alert(JSON.stringify(data));
                        }, function(resp) {
                            alert(JSON.stringify(resp));
                        });
                        break;
                    case "department":
                        deli.app.department.select({
                            "id":"355669228033933312",
                            "name": "可选部门",
                            "mode": "multi", //多选
                            "root_dept_id": "355671868335718401", //设置可选顶级部门的Id
                            "max": 200, //选择部门数限制
                            "selected_dept_ids": ["355671868335718404", "355678628404527106"],
                            //已选的部门
                            "disabled_dept_ids": ["355678628404527106", "355678749540220928"]
                            //禁止选择的部门
                        }, function(data) {
                            alert(JSON.stringify(data));
                        }, function(resp) {
                            alert(JSON.stringify(resp));
                        });
                        break;
                    case "scan":
                        deli.app.code.scan({
                            type:'',
                            app_id:'123456'
                        },function(data){
                            alert(JSON.stringify(data));
                        },function(resp){
                            alert(JSON.stringify(resp));
                        });
                    break;
                    case "preloadershow":
                        deli.common.notification.showPreloader({
                        },function(data){
                        },function(resp){});
                    break;
                    case "preloaderhide":
                        deli.common.notification.hidePreloader({
                        },function(data){
                        },function(resp){});
                    break;
                    case "navigationshow":
                        deli.common.navigation.show({
                        },function(data){
                        },function(resp){});
                    break;
                    case "navigationhide":
                        deli.common.navigation.hide({
                        },function(data){
                        },function(resp){});
                    break;
                }
            });
            setTimeout(function(){
                deli.common.navigation.goBack({},function(data){
                    deli.common.navigation.setTitle({
                        "title": "得力应用"
                    }, function(data) {}, function(resp) {});
                },function(resp){});
            }, 500);
        }
    };
    Page.init();
    // 验证签名成功
    deli.ready(function() {
    });
    // 验证签名失败
    deli.error(function(resp) {
        alert(JSON.stringify(resp));
    });
})();
