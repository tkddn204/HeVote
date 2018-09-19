let candidate;

$(document).ready(() => {

    // ref: https://codepen.io/JacobLett/pen/jzdYPz
    $(".card")
        .hover(
            () => $(this).addClass('shadow').css('cursor', 'pointer'),
            () => $(this).removeClass('shadow'))
        .click(() => {
            // border 추가 및 그림자 제거
            $(this).addClass('border-primary');
            $(this).removeClass('shadow');

            // candidate 저장
            candidate = $(this).attr("value");

            // 다른 카드의 border 제거
            $(".card").each(() => {
                if ($(this).attr("value") !== candidate) {
                    $(this).removeClass('border-primary');
                }
            })
        });

    $("form").on("submit", function (event) {
        event.preventDefault();

        const url = $(this).attr("action");
        const data = {candidate: candidate};
        if (!candidate) {
            alert("후보를 선택해주세요!");
            return;
        }

        // 로딩 상태로 변경
        $(".btn").button('loading');

        $.post(url, data);
    });
});