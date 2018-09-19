$(document).ready(() => {
    // 로딩 상태로 변경
    $(".btn-primary").click(() => {
        const $this = $(this);
        $this.button('loading');
        setTimeout(() => {
            $this.button('reset')
        }, 10000);
    });
});