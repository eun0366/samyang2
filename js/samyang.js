$(function () {
    // gnbWrap과 대메뉴 변수지정
    var wrap = $('.gnbWrap');
    var menu = $('.gnbWrap > ul.gnb>li');
    // 현재의 각 페이지 URL 가져옴 
    var pageURL = location.href;
    var activeMenu; // 활성 메뉴 저장변수(선언만함)

    // 메뉴이벤트
    // mouseover - 마우스 올렸을때
    // mouseout - 마우스 벗어났을때
    menu.on({
        mouseover: function () {
            var tg = $(this); // this (=) gnbWrap > ul.gnb > li 
            menu.removeClass('on'); // 모든 메뉴에서 on 클래스 삭제 
            tg.addClass('on'); // 이벤트가 일어난 메뉴에  'on' 클래스 추가
            var th = 68 + tg.children('.sGnbArea').height();
            // gnbWrap 의 높이값 계산 
            // ul.gnb > li 로 되어있는 대메뉴의 자식인 div.sGnbArea 
            // var th = 68; // 기본 높이를 68px로 초기화 해주었음
            // 반환 - 함수를 호출한 곳으로 전달하는 동작 
            wrap.stop().animate({
                height: th
            }); // wrap 에  높이 애니메이션 설정 
        },
        // 마우스가 벗어났을때의 이벤트 
        mouseout: function () {
            var tg = $(this); // 현재 메뉴 
            tg.removeClass('on'); // on 클래스 제거 
            var th = 68; // 초기 Wrap 높이
            wrap.stop().animate({
                height: th
            });
            // wrap의 높이에 애니메이션 설정
        }
    });

    // 메뉴 아이템 순회 
    // .each - 반복문 메서드 - 반복 작업 진행시 사용 
    // index 에 접근하게 해주기 위해 function에 i를 넣어줌 

    menu.each(function (i) {
        var tg = $(this); // 현재 아이템
        var sub = tg.find('> .sGnbArea > ul > li');
        // submenu의 li
        var menuURL = tg.children('a').attr('href');
        // 현재 메뉴의 링크 URL
        // .indexOf() - 요소의 위치를 찾는데 사용하는 메서드 (함수)
        var active = pageURL.indexOf(menuURL);
        if (active > -1) activeMenu = tg;
        sub.each(function (i) {
            var tg = $(this); // 현재 요소 
            // 현재 하위 메뉴
            var subURL = tg.children('a').attr('href');
            // 아이템의 링크 URL
            active = pageURL.indexOf(subURL);
            // 현재 페이지 URL에 하위 메뉴 URL 을 포함하고 있는지 확인
            if (active > -1) activeMenu = tg;
        });

        // 하위 메뉴 아이템에 대한 이벤트 핸들러 설정
        sub.on({
            // 마우스올렸을때
            mouseover: function (event) {
                var tg = $(this); // 현재요소
                sub.removeClass('on'); // 모든 서브메뉴 on제거
                tg.addClass('on'); // 현재서브 on추가
            },
            // 마우스 벗어났을때
            mouseout: function () {
                var tg = $(this); // 현재요소
                tg.removeClass('on'); // 현재하위요소 on제거
            }
        });
    });


    // ========================================= slide 

    // 슬라이드와 버튼 요소 선택
    var visual = $('#main_slides > ul.slides_container > li');
    var button = $('#main_slides > ul.slides-pagenation > li');
    var current = 0; // 현재 활성화된 슬라이드 인덱스
    var setIntervalId; // 자동 슬라이드 간격을 관리할 변수

    // 버튼 클릭 이벤트 처리
    button.on({
        click: function () {
            var tg = $(this);
            var i = tg.index();
            button.removeClass('on'); // 모든 버튼에서 'on' 클래스 제거
            tg.addClass('on'); // 클릭한 버튼에 'on' 클래스 추가
            move(i); // 해당 인덱스의 슬라이드로 이동
        }
    });

    // 이전 슬라이드 버튼 클릭 이벤트 처리
    $('#prev').click(function () {
        var n = current - 1; // 현재 활성화된 슬라이드의 인덱스에서 1을 뺍니다. 이는 이전 슬라이드로 이동하기 위한 인덱스를 계산합니다.

        if (n == -1) {
            n = visual.size() - 1; // 슬라이드의 첫 번째 슬라이드에서 이전을 누르면, 마지막 슬라이드로 이동하도록 합니다. 이 부분은 슬라이드 순환을 처리합니다.
        }

        move(n); // 계산된 인덱스로 슬라이드를 이동시킵니다.


        button.eq(n).trigger('click'); // 이전 슬라이드에 해당하는 버튼을 클릭한 것과 동일한 효과를 주기 위해 해당 버튼을 클릭 이벤트로 처리합니다.


        return false; // 이벤트 처리 후 기본 동작을 방지하기 위해 false를 반환합니다. 예를 들어, 링크의 기본 동작(페이지 이동)을 방지합니다.

    });

    // 다음 슬라이드 버튼 클릭 이벤트 처리
    $('#next').click(function () {
        var n = current + 1;
        // 현재의 current 변수에 1을 더하여 다음 슬라이드를 선택하는 인덱스를 준비합니다.

        if (n == visual.size()) {
            // 만약 n 값이 이미 슬라이드의 총 개수와 동일하다면,
            // 다음 슬라이드가 없다는 의미입니다.
            n = 0; // n 값을 0으로 설정하여 처음 슬라이드로 돌아갑니다.
        }

        move(n); // move() 함수를 호출하여 슬라이드를 변경합니다.

        button.eq(n).trigger('click');
        // n 번째 버튼(페이지네이션 버튼)을 선택하고 이 버튼에 대한 클릭 이벤트를 강제로 실행시킵니다.
        return false;
        // 클릭 이벤트의 기본 동작을 중단시키고, 페이지 이동을 막습니다.

    });





    // 마우스가 슬라이드 영역에 머물렀을때 슬라이드 전환 효과를 정지시키는 이벤트 

    $('#main_slides').on({
        mouseover: function () {
            clearInterval(setIntervalId);
            // clearInterval - 주기적인 작업 중단 
            // setIntervalId - 슬라이드쇼 전환시 사용 (일정시간 간격식별 변수)           
        },
        // 마우스가 벗어났을때 슬라이드 다시 시작
        mouseout: function () {
            timer();
            // timer() - 슬라이드 자동전환 타이머 시작 함수호출
        }
    });

    timer(); // 페이지 로딩 후 초기 슬라이드 자동 시작 


    // 자동 슬라이드 동작 함수 
    function timer() {
        setIntervalId = setInterval(function () {
            var n = current + 1;
            if (n == visual.size()) {
                n = 0; // 다음 슬라이드가 없으면, 0으로 돌아감 
            }
            // 다음 슬라이드 버튼을 클릭하여 슬라이드 변경 
            button.eq(n).click();
        }, 3000); // 3초 
    }

    // 슬라이드 이동 함수 
    function move(i) {
        if (current == i) return;
        // 현재 활성된 슬라이드의 목표 슬라이드가 같으면 동작하지 않음
        var currentEl = visual.eq(current); // 현재 슬라이드 
        var nextEl = visual.eq(i); // 목표 슬라이드

        currentEl.css({
            left: '0%'
        }).stop().animate({
            left: '-100%'
        }); // 슬라이드 왼쪽으로 이동

        nextEl.css({
            left: '100%'
        }).stop().animate({
            left: '0%'
        });
        current = i; // 현재 슬라이드 인덱스를 갱신 (=업데이트)
    }

// 따라다니는 퀵메뉴 - 스크롤바가 이동될때마다 이벤트 발생
    $(window).scroll(function(){
// 현재 스크롤 위치를 가져오고 15px 더함
        var scrollTopNum = $(document).scrollTop()+15; 
        if (scrollTopNum <= 200) {
            scrollTopNum = 200; 
        }
        // scrollTopNum이 200보다 작거나 같으면 200으로 고정
        // #quick을 0.7초동안 scrollTopNum 위치에 부드럽게 이동시킴 
        $("#quick").stop().animate({top:scrollTopNum},700);
    });


    $("#quick .arrow").on("click", function () {
        $("html,body").stop().animate({
            scrollTop: 0 // 수직 스크롤 위치 
        }, 400);
    });
	
	
	// 신제품 슬라이드
// 슬라이드에 관련된 JavaScript 코드
var slides = $("div.product-new > ul > li"); // 슬라이드 이미지 요소들
var controlButtons = $("div.product-new > .control > li"); // 슬라이드 제어 버튼 요소들
var autoSlideIntervalId; // 자동 슬라이드를 위한 setInterval의 ID
var currentSlideIndex = 0; // 현재 보여지고 있는 슬라이드의 인덱스

function moveToSlide(index) {
    if (currentSlideIndex === index) return;

    var currentSlide = slides.eq(currentSlideIndex);
    var nextSlide = slides.eq(index);

    currentSlide.css({ left: '0%' }).stop().animate({ left: '-100%' });
    nextSlide.css({ left: '100%' }).stop().animate({ left: '0%' });

    currentSlideIndex = index;
}

// 슬라이드 제어 버튼 클릭 이벤트 처리
controlButtons.on({
    click: function () {
        var clickedButton = $(this);
        var buttonIndex = clickedButton.index();
        controlButtons.removeClass('on');
        clickedButton.addClass('on');
        moveToSlide(buttonIndex);
        return false;
    }
});

// 슬라이드 영역에 마우스를 올렸을 때 처리
$('div.product-new').on({
    mouseover: function () {
        clearInterval(autoSlideIntervalId);
    },
    mouseout: function () {
        startAutoSlide();
    }
});

// 자동 슬라이드를 실행하는 함수
function startAutoSlide() {
    autoSlideIntervalId = setInterval(function () {
        var nextSlideIndex = currentSlideIndex + 1;
        if (nextSlideIndex === slides.size()) {
            nextSlideIndex = 0;
        }
        controlButtons.eq(nextSlideIndex).click();
    }, 2000);
}

// 초기 자동 슬라이드 시작
startAutoSlide();


});


