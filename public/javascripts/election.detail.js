$(document).ready(() => {

    const changeTextWhileLoading = (event, loadingText) => {
        const $this = $(event.target);

        if ($this.html() !== loadingText) {
            $this.html(loadingText);
            $this.attr('disabled', true);
        }
    };

    $(".btn[type='submit']").click((event) => {
        const loadingText = "변경 중입니다...";
        changeTextWhileLoading(event, loadingText);
        if($(event.target).attr("id") === "stateChangeButton") {
            $('#stateChangeForm').submit();
        } else if ($(event.target).attr("id") === "infoChangeButton") {
            $('#infoChangeForm').submit();
        }
    });

    $("#participateVote").click((event) => {
        const loadingText = "잠시만 기다려주세요...";
        changeTextWhileLoading(event, loadingText);

        const $this = $(event.target);
        window.location.replace($this.attr('data'));
    });

    $("button[id^='commitmentBtn']").click((event) => {
        const index = parseInt(event.target.id.slice(-1));
        const card = $('.card')[index];
        const title = $(card).find('h5').text();
        const content = $(card).find('p').text();
        $('#modalTitle').text(title);
        $('#modalContent').text(content);
    });
});