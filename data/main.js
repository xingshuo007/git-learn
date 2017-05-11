/**
 * Created by xingshuo365 on 2017/5/10.
 */

var Mock=require('mockjs');
//node.js的写法
exports.data=function(){
    return [
        {
            route:"/index",
            handle:function(req,res,next){
                //req  请求头
                //res  响应的数据
                //res 请求头是模拟的后台数据返回告诉浏览器返回数据头，没有头的话数据出不来
                res.writeHead(200,{
                    "Content-type":"application/json;charset=utf-8",
                    "Access-Control-Allow-Origin":"*"//允许所有主机进行请求
                });
                var data={
                    name:"yanxiaosu",
                    sex:"girl",
                    hobby:"handwriting"
                };
                res.write(JSON.stringify(data));
                res.end();//有开头有结尾不然数据依然无返回
            }
        },
        {
            route:"/demo",
            handle:function(req,res,next){
                //req  请求头
                //res  响应的数据
                //res 请求头是模拟的后台数据返回告诉浏览器返回数据头，没有头的话数据出不来
                res.writeHead(200,{
                    "Content-type":"application/json;charset=utf-8",
                    "Access-Control-Allow-Origin":"*"//允许所有主机进行请求
                });
                var Random=Mock.Random;
                Random.integer();
                Random.string("lower",4);
                Random.date("yyyy-MM-dd");
                var data=Mock.mock({
                    "menuList|6":[{
                        "menuNav":"@string()",
                        "menuNavContent|1-5":[{
                            "url":"index.html",
                            "name":"@string('lower',4)",
                            "id":"@integer(0,10)"
                        }]
                    }]
                });
                res.write(JSON.stringify(data));
                res.end();//有开头有结尾不然数据依然无返回
            }
        }
    ]
};