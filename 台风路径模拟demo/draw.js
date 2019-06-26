    
    //引入mapbox api
    var mapboxUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWVldGx4eSIsImEiOiJjanhic3g0NjcwMDdtM3lvNTljOHB5aHhuIn0._A_y4vwhaOGGCE7IGkp7IA';
    //自定义版权信息
    var mapAttr='Map data &copy;<a href="https://www.openstreetmap.org/">openstreetmap</a>contributors,'+
                'Lv_Xinyan,'+
                'Imagery © <a href="https://www.mapbox.com/">MapBox</a> ';
            
    //定义两个图层
    var satellite = L.tileLayer(mapboxUrl, { id: 'mapbox.satellite',attribution:mapAttr});
    var streets = L.tileLayer(mapboxUrl, { id: 'mapbox.streets',attribution:mapAttr});
            
    //创建地图
    var map=L.map('map',{
            center:[18.7,119.3],
            zoom:5,
    //展示两个图层
            layers:[satellite,streets]
        });

    //通过Layer Control 实现图层切换
    var baseLayers = {
        "影像图": satellite,
        "街道图": streets
        };
        L.control.layers(baseLayers).addTo(map);

    //数据转换
    function dataHandler(){
            //获取台风坐标点数据对象
            var forecast=typhoonTestData[0]['points'];
            //定义折线点数据
            var polylinePoints=[];
            //循环拼接数据[[经度，纬度]，[经度，纬度]]的格式
            for(var i=0;i<forecast.length;i++){
                var p=forecast[i];
                polylinePoints.push([Number(p['lat']),Number(p['lng'])]);
            }
            return polylinePoints;

        }


    var allpoints=dataHandler();
        //根据坐标点数组polylinePoints通过L.polyline方法绘制折线，颜色为蓝色blue
        polyline=L.polyline(allpoints,{color:'blue'}).addTo(map);
        //获取折线的最外层矩形区域
        map.fitBounds(polyline.getBounds());
        map.removeLayer(polyline);
        animateDrawLine();

    var lineLayer;
    var marker;
    //获取台风信息
    var land=typhoonTestData[0]['land'][0];
    // 自定义台风logo
    var myIcon = L.icon({
        iconUrl: 'typhoon.png',
        iconSize: [28, 28],
        iconAnchor: [10, 10]
    });
    

    //动态绘制折线
    function animateDrawLine(){
    //allpoints为数据转换的结果
    var length=allpoints.length;
    //定义用来存放递增元素的经纬度数据
    var drawPoints=[];
    var count=0;
    //定时器100ms,动态地塞入坐标数据
    var timer=setInterval(function(){
        if(count<length){
            drawPoints.push(allpoints[count]);
            count++;
    //消除之前绘制的折线图层
        if(lineLayer && count !==length){
            map.removeLayer(lineLayer);
                lineLayer=null;
        }
    //消除marker图层
        if(marker && count !==length){
            map.removeLayer(marker);
            marker=null;
        }
    //最新数据点drawpoints绘制折线
            lineLayer=L.polyline(drawPoints,{color:'blue'}).addTo(map);

    //根据最新数组最后一个点绘制marker
            if(count===length){
                map.removeLayer(marker);
        //如果是台风最后一个点，则自动Popup弹窗
        marker=L.marker(drawPoints[length-1],{icon:myIcon}).addTo(map)
        .bindPopup("<b>"+ typhoonTestData[0]['name'] +"</b><br>"+land['info']+"<br>"+land['landtime']+"<br>经度："+land['lng']+"<br>纬度："+land['lat']+"<br>强度："+land['strong']+"<br><br><b>Author: Lv_Xinyan</b>").openPopup();
          
            }else{
                marker=L.marker(drawPoints[count-1],{icon:myIcon}).addTo(map)
            }    
    }else{
    //取完数据后清除定时器
            clearInterval(timer);

                }
            },100);

        }




            




  