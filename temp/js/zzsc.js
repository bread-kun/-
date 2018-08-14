
function kvFn(){
    
    $(".kvBox .slog_1").animate({top:63},{duration:1000,easing:"swing",complete:function(){
        gifFn();
    }});
    $(".kvBox .slog_2").animate({top:128},{duration:1100,easing:"swing",complete:function(){ }});
    $(".kvBox .slog_3").animate({top:179},{duration:1200,easing:"swing",complete:function(){ }});
    $(".kvBox .slog_4").animate({top:252},{duration:1300,easing:"swing",complete:function(){ }});
    var gifFn = function(){
        $(".kvBox .gif_1").animate({width:86},500,function(){
            $(".kvBox .gif_2").animate({width:86},500,function(){
                setTimeout(function(){
                    $(".kvBox .gif_2").animate({width:0},500,function(){
                        $(".kvBox .gif_1").animate({width:0});
                    });
                },3000)
            });
        });
    };

    var timer = setInterval(function(){
        gifFn();
    },6000);

    //云朵
    var _xy = "10px 0",x=0;
    setInterval(function(){
        x = x + 0.5;
        _xy = x + "px 0";
        $(".kvBox .cloud").css({backgroundPosition:_xy});
    },13);

    //飞机
    setTimeout(function(){
        $(".kvBox .air").animate({left:1060,top:40},1000,'swing');
    },1500);

    //人
    setTimeout(function(){
        $(".kvBox .person").animate({left:0,top:0},1000,'swing');
    },100);
}
$(function(){
	kvFn();
})



