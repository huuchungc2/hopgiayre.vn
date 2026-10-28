$(function () {

    $('.shop-header__bottom__dropdown').hover(
        function () {
          $('.shop-header__top').addClass('uk-background-05');
          $('.mask_menu').fadeIn(300);
        },
        function () {
          $('.shop-header__top').removeClass('uk-background-05');
          $('.mask_menu').stop(true, true).fadeOut(300);
        }
      );

})

var app = angular.module('main-app', ['ngPagination', 'angular.lazyimg']);
app.config(function ($interpolateProvider, $compileProvider) {
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
});

app.run(function ($rootScope, $location, $locale, $http, $sce) {
    $locale.NUMBER_FORMATS.GROUP_SEP = ".";

    $rootScope.trustedHtml = function (plainText) {
        return $sce.trustAsHtml(plainText);
    }

    const dm = 'https://hopgiayre.vn/';
    $rootScope.zoa = {};
    $rootScope.zoa.domain = dm;
    $rootScope.zoa.staticDomain =  dm + 'upload';
    $rootScope.zoa.imgProductDomain = dm + 'upload/imgproduct/';
    $rootScope.zoa.imgBannerDomain = dm + 'upload/imgbanner/';
    $rootScope.zoa.appDomain = dm + 'api';
    $rootScope.goLink = function (url) {
        // console.log("golink: " + url)
        window.location = url;
    }

    $rootScope.isValidPhoneNumber = function(mobile) {
        var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        if(mobile !==''){
            if (vnf_regex.test(mobile) == false) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    $rootScope.searchProduct = function (keyword) {
        if (keyword.length >= 3) {
            $http({
                method: 'GET',
                url: $rootScope.zoa.appDomain + "/product/get_slice",
                params: {
                    keyword: keyword
                }
            }).then(function(resp) {
                if(resp.data) {
                    $rootScope.sProducts = resp.data.list_data;
                    console.log($rootScope.sProducts);
                }
            });
        } else {
            $rootScope.sProducts = [];
        }
    }

    $rootScope.mGetViewedProduct = function (listIds) {
        $rootScope.listViewedProduct = [];
        $http({
            method: 'GET',
            url: $rootScope.zoa.appDomain + "/product/mget",
            params: {
                ids: listIds
            }
        }).then(function(resp) {
            if(resp.data) {
                $rootScope.listViewedProduct = resp.data.list_data;
                console.log("listViewedProduct", $rootScope.listViewedProduct);
            }
        });
    }

    $rootScope.mGetRelatedProduct = function (listIds) {
        $rootScope.listRelatedProduct = [];
        $http({
            method: 'GET',
            url: $rootScope.zoa.appDomain + "/product/mget",
            params: {
                ids: listIds
            }
        }).then(function(resp) {
            if(resp.data) {
                $rootScope.listRelatedProduct = resp.data.list_data;
                console.log("listRelatedProduct", $rootScope.listRelatedProduct);
            }
        });
    }

    $rootScope.zuser = {name: '', phone: '', email: '', pass1: '', pass2: ''}

    $rootScope.regUser = function() {
        if ($rootScope.zuser.name && $rootScope.zuser.phone && $rootScope.zuser.email && $rootScope.zuser.pass1 && $rootScope.zuser.pass2) {
            if ($rootScope.zuser.pass1 !== $rootScope.zuser.pass2) {
                UIkit.notification({message: "Mật khẩu không khớp, vui lòng kiểm tra lại.", status: 'danger', pos: 'top-right'})
            }

            var data = $.param({
                txtTenHienThi: $rootScope.zuser.name || "",
                txtMatKhau: $rootScope.zuser.pass1 || "",
                txtEmail: $rootScope.zuser.email || "",
                txtPhone: $rootScope.zuser.phone || ""
            })
            var config = {headers: {'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'}}
            $http.post($rootScope.zoa.domain + "api/user/register", data, config)
            .then(function(res) {
                if (res.data.error >= 0) {
                    UIkit.modal("#modal-login").show();
                    UIkit.notification({message: "Đăng ký thành công.", status: 'success', pos: 'top-right'})
                    $rootScope.zuser = {name: '', phone: '', email: '', pass1: '', pass2: ''}
                } else {
                    UIkit.notification({message: res.data.message, status: 'danger', pos: 'top-right'})
                }
            }, function(err){})
        } else {
            UIkit.notification({message: "Dữ liệu không hợp lệ, vui lòng kiểm tra lại.", status: 'danger', pos: 'top-right'})
        }
    }

    $rootScope.loginUser = function() {
        if ($rootScope.zuser.phone && $rootScope.zuser.pass1) {
            var data = $.param({
                user: $rootScope.zuser.phone || "",
                pass: $rootScope.zuser.pass1 || ""
            })
            var config = {headers: {'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'}}
            $http.post($rootScope.zoa.domain + "api/user/login", data, config)
            .then(function(res) {
                if (res.data.error >= 0) {
                    UIkit.notification({message: "Đăng nhập thành công.", status: 'success', pos: 'top-right'})
                    UIkit.modal("#modal-login").hide();
                    console.log(res.data.data);
                    $rootScope.dataUser = {name: res.data.data.u_name, phone: res.data.data.u_phone, email: res.data.data.u_email}
                } else {
                    UIkit.notification({message: res.data.message, status: 'danger', pos: 'top-right'})
                }
            }, function(err){})
        } else {
            UIkit.notification({message: "Dữ liệu không hợp lệ, vui lòng kiểm tra lại.", status: 'danger', pos: 'top-right'})
        }
    }

    $rootScope.forgotPassword = function() {
        if ($rootScope.zuser.email && $rootScope.zuser.phone && $rootScope.isValidPhoneNumber($rootScope.zuser.phone)) {
            var data = $.param({
                email: $rootScope.zuser.email || "",
                phone: $rootScope.zuser.phone || ""
            })
            var config = {headers: {'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'}}
            $http.post($rootScope.zoa.domain + "api/user/forgotPassword", data, config)
            .then(function(res) {
                if (res.data.error >= 0) {
                    UIkit.notification({message: "Mật khẩu đã gửi đến email của bạn.", status: 'success', pos: 'top-right'})
                    UIkit.modal("#modal-forgot").hide();
                    UIkit.modal("#modal-login").show();
                    console.log(res.data.data);
                    $rootScope.dataUser = {name: res.data.data.u_name, phone: res.data.data.u_phone, email: res.data.data.u_email}
                } else {
                    UIkit.notification({message: res.data.message, status: 'danger', pos: 'top-right'})
                }
            }, function(err){})
        } else {
            UIkit.notification({message: "Dữ liệu không hợp lệ, vui lòng kiểm tra lại.", status: 'danger', pos: 'top-right'})
        }
    }

});

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
})

app.directive('convertToNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (val) {
                return val != null ? parseInt(val, 10) : null;
            });
            ngModel.$formatters.push(function (val) {
                return val != null ? '' + val : null;
            });
        }
    };
});
app.directive('jsonText', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ngModel) {
            function into(input) {
                try {
                    return JSON.parse(input);
                } catch (error) {

                }
            }
            function out(data) {
                return JSON.stringify(data);
            }
            ngModel.$parsers.push(into);
            ngModel.$formatters.push(out);

        }
    };
});

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function htmlDecode(input){
    var e = document.createElement('textarea');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

// function insertParam(key, value) {
//     key = encodeURIComponent(key); value = encodeURIComponent(value);

//     var s = window.location.search;
//     var kvp = ""
//     if (value) {
//         kvp = key+"="+value;
//     }
//     if (!s) {
//         console.log("zzz rong")
//         document.location.search = kvp;
//     }

//     var r = new RegExp("(&|\\?)"+key+"=[^\&]*");
//     s = s.replace(r,"$1"+kvp);

//     if(!RegExp.$1) {s += (s.length>0 ? '&' : '?') + kvp;} else { s = kvp};

//     document.location.search = s;
// }

function insertParam(key, value) {
    key = encodeURIComponent(key);
    value = encodeURIComponent(value);

    // kvp looks like ['key1=value1', 'key2=value2', ...]
    var kvp = document.location.search.substr(1).split('&');
    let i=0;

    for(; i<kvp.length; i++){
        if (kvp[i].startsWith(key + '=')) {
            let pair = kvp[i].split('=');
            pair[1] = value;
            kvp[i] = pair.join('=');
            break;
        }
    }

    if(i >= kvp.length){
        kvp[kvp.length] = [key,value].join('=');
    }

    // can return this or...
    let params = kvp.join('&');

    // reload page with new params
    document.location.search = params;
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultvalue) {
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
    }
    return urlparameter;
}
