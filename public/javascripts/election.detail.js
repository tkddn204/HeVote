$(document).ready(() => {

    $("button[class=btn-primary]").click(() => {
        const $this = $(event.target);
        const loadingText = "잠시만 기다려주세요...";

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
    });
});