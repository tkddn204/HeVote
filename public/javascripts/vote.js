$(document).ready(() => {

    $(".btn[type=submit]").click((event) => {
        const $this = $(event.target);
        const loadingText = "투표 중입니다...";

        const candidate = $('input[name="candidate"]:checked').val();
        if (!candidate) {
            alert("후보를 선택해주세요!");
            return;
        } else {
            $("form").submit();
        }
        if ($this.html() !== loadingText) {
            $this.html(loadingText);
            $this.attr('disabled', true);
        }
    });

    $("button[id^='commitmentBtn']").click((event) => {
        const index = parseInt(event.target.id.slice(-1));
        const card = $('.card')[index];
        const title = $(card).find('h5').text();
        const content = $(card).find('p').text();
        $('#modalTitle').text(title);
        $('#modalContent').text(content);
    })
});