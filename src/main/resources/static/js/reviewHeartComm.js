let isLike = []; // 좋아요 여부
let prIdx = []; // 로그인한 회원
let revIdx = []; // 리뷰 번호
let heartNum = []; // 리뷰 좋아요 개수
let data = [];
let revComm = []; // 리뷰 댓글 개수
totalList();    // 리뷰 좋아요 및 댓글 개수 호출
comList();      // 리뷰별 댓글 호출

// 리뷰 좋아요 여부, 좋아요 개수, 댓글 개수
function totalList() {
    $.ajax({
        type: 'GET',
        url: "/timeline/review/total",
        success: function (data) {
            console.log(data);
            $.each(data, function (index, item) { // 데이터 =item
                isLike.push(item.isLike);
                prIdx.push(item.prIdx);
                revIdx.push(item.revIdx);
                heartNum.push(item.heartNum);
                revComm.push(item.revComm);
            });

            for (let i = 0; i < data.length; i++) {
                if (isLike[i] == true) {
                    console.log("⭕");
                    let like = "<span class='__like __on " + revIdx[i] + "'" +
                        "onclick='heart(" + prIdx[i] + "," + revIdx[i] + "," + isLike[i] + "," + heartNum[i] + ")'>"
                        + heartNum[i] + "</span>"
                    let comm = "<span class='__comment' onclick='isOpen(" + revIdx[i] + ")'>" + revComm[i] + "</span>";
                    $('.heart' + revIdx[i]).append(like);
                    $('.comment' + revIdx[i]).append(comm);
                } else {
                    console.log("❌");
                    let unlike = "<span class='__like " + revIdx[i] + "'" +
                        "onclick='heart(" + prIdx[i] + "," + revIdx[i] + "," + isLike[i] + "," + heartNum[i] + ")'>"
                        + heartNum[i] + "</span>"
                    let comm = "<span class='__comment' onclick='isOpen(" + revIdx[i] + ")'>" + revComm[i] + "</span>";
                    $('.heart' + revIdx[i]).append(unlike);
                    $('.comment' + revIdx[i]).append(comm);
                }
            }
            return data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("ERROR : " + textStatus + " : " + errorThrown);
        }
    });
}

// 리뷰 좋아요 여부 판단
function heart(prIdx, revIdx, isLike, heartNum) {
    if (isLike) {
        console.log(isLike)
        hearting(prIdx, revIdx, false, heartNum);       // 좋아요 취소
    } else {
        console.log(isLike)
        hearting(prIdx, revIdx, true, heartNum);
    }

}

// 리뷰 좋아요 기능
function hearting(prIdx, revIdx, check, heartNum) {
    if (check) {
        console.log('❤️' + heartNum);
        let param = {"prIdx": prIdx, "revIdx": revIdx, 'revLike': heartNum};
        $.ajax({
            type: 'POST',
            data: JSON.stringify(param),
            url: "/timeline/new/heart",
            contentType: "application/json",
            success: function (data) {
                console.log(data);
                let liked = "<span class='__like __on " + revIdx + "'" +
                    "onclick='heart(" + prIdx + "," + revIdx + "," + true + "," + heartNum + ")'>"
                    + (data) + "</span>"
                $('.' + revIdx).replaceWith(liked);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("ERROR : " + textStatus + " : " + errorThrown);
            }
        });
    } else {
        // 좋아요 취소
        console.log('💙' + heartNum);
        let del = {"prIdx": prIdx, "revIdx": revIdx, 'revLike': heartNum}
        $.ajax({
                type: 'POST',
                data: JSON.stringify(del),
                url: "/timeline/del/heart",
                contentType: "application/json",
                success: function (data) {
                    console.log(data);
                    let unliked = "<span class='__like " + revIdx + "'" +
                        "onclick='heart(" + prIdx + "," + revIdx + "," + false + "," + heartNum + ")'>"
                        + (data) + "</span>"
                    $('.' + revIdx).replaceWith(unliked);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("ERROR : " + textStatus + " : " + errorThrown);
                }
            }
        )

    }
}

// 댓글 관련
let comContent = []; // 댓글 내용
let comNick = []; // 댓글 쓴 사람 닉네임
let comLike = []; // 댓글 좋아요 갯수
let comRegDate = []; // 댓글 등록일
let comIdx = []; // 댓글 번호
let revComIdx = [];     // 댓글 리뷰 번호
let isComm = [];    // 댓글 작성자 여부
let isCommLike = [];    // 댓글 좋아요 여부
let dataList = [];
let comPrIdx = [];

// 전체 댓글 가져오기
function comList() {
    $.ajax({
        type: 'GET',
        url: "/timeline/review/comment",
        contentType: "application/json",
        success: function (data) {
            console.log(data);
            $.each(data, function (index, item) { // 데이터 =item
                comIdx.push(item.comIdx);
                comNick.push(item.prNick);
                comContent.push(item.comContent);
                revComIdx.push(item.revIdx);
                comLike.push(item.comLike);
                comRegDate.push(item.regDate);
                isComm.push(item.isComm);
                isCommLike.push(item.isComLike);
                comLike.push(item.comLike);
                comPrIdx.push(item.prIdx);
            });
            dataList = data;
            // isAction = true;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("ERROR : " + textStatus + " : " + errorThrown);
        }
    })
}

// // 댓글 번호찾기
// function list(comIdx) {
//     $.ajax({
//         type: 'GET',
//         url: "/timeline/review/get/comment/" + comIdx,
//         contentType: "application/json",
//         success: function (data) {
//             console.log(data);
//             return data;
//         },
//         error: function (jqXHR, textStatus, errorThrown) {
//             alert("ERROR : " + textStatus + " : " + errorThrown);
//         }
//     })
// }


// 댓글div 열려있는지 여부 판단 및 열고 닫기
function isOpen(review) {
    console.log($('#showCom' + review).is('.__block'));
    if ($('#showCom' + review).is('.__block') === false) {
        if ($('#showCom' + review).is('.__isOpen') === false) {
            showComment(review);
            $('#showCom' + review).addClass('__block __isOpen');
        } else {
            $('#showCom' + review).addClass('__block');
        }
    } else {
        $('#showCom' + review).removeClass('__block');
    }
}

// 댓글 작성하는 로직
function showComment(review) {
    console.log(dataList.length);
    // 댓글 블록 안에 작성
    for (let i = 0; i < dataList.length; i++) {
        if (revComIdx[i] == review) {
            let comment;
            if (isCommLike[i]) {
                console.log("isCommLike true")
                console.log(i+'번째..')
                console.log(isCommLike[i])
                console.log(comLike[i])
                console.log(comIdx[i])
                comment = "<div class='__user-info'> " +
                    "<a class='profile'> <div class='profile-pic'> " +
                    "<img src='https://catchtable.co.kr/web-static/static_webapp_v2/img/noimg/profile_default_v2.png' class='img'" +
                    "style='background: url(&quot;data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7&quot;) center center no-repeat transparent;'>" +
                    "</div> " +
                    "<h4 class='name username'>" +
                    "<span class='txt'>" + comNick[i] + "</span>" +
                    "</h4> " +
                    "<div class='__post-meta'> " +
                    "<span class='__like __on comLike" + comIdx[i] + "' onclick='comHeart(" + comIdx[i] + "," + comLike[i] + "," + isCommLike[i] + "," + revComIdx[i] + "," + comPrIdx[i] + ")'>"
                    + comLike[i] + "</span> " +
                    "</div></a></div> " +
                    "<div class='__content'><p class='content'>" + comContent[i] + "</p>" +
                    "</div><div class='__post-meta'> " +
                    "<span class='__date' style='font-size: 13px;flex-direction: row-reverse;'>" + comRegDate[i] + "</span> " +
                    "<a class='__more' onclick='reportComment(" + comIdx[i] + "," + isComm[i] + "," + revComIdx[i] + "," + ")'>MORE</a></div>" +
                    "<hr class='hairline'>";
            } else {
                console.log("isCommLike false")
                console.log(i+'번째..')
                console.log(isCommLike[i])
                console.log(comLike[i])
                console.log(comIdx[i])
                comment = "<div class='__user-info'> " +
                    "<a class='profile'> <div class='profile-pic'> " +
                    "<img src='https://catchtable.co.kr/web-static/static_webapp_v2/img/noimg/profile_default_v2.png' class='img'" +
                    "style='background: url(&quot;data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7&quot;) center center no-repeat transparent;'>" +
                    "</div> " +
                    "<h4 class='name username'>" +
                    "<span class='txt'>" + comNick[i] + "</span>" +
                    "</h4> " +
                    "<div class='__post-meta'> " +
                    "<span class='__like comLike" + comIdx[i] + "' onclick='comHeart(" + comIdx[i] + "," + comLike[i] + "," + isCommLike[i] + "," + revComIdx[i] + "," + comPrIdx[i] + ")'>"
                    + comLike[i] + "</span> " +
                    "</div></a></div> " +
                    "<div class='__content'><p class='content'>" + comContent[i] + "</p>" +
                    "</div><div class='__post-meta'> " +
                    "<span class='__date' style='font-size: 13px;flex-direction: row-reverse;'>" + comRegDate[i] + "</span> " +
                    "<a class='__more' onclick='reportComment(" + comIdx[i] + "," + isComm[i] + "," + revComIdx[i] + ")'>MORE</a></div>" +
                    "<hr class='hairline'>";
            }
            // 댓글 신고 및 삭제
            let reportCom = "<div><div class='modal " + comIdx[i] + " modal-overlay'> <div class='modal-window'>" +
                "<div class='close-area close" + comIdx[i] + "' onclick='closeCom(" + comIdx[i] + ")'>X</div> <div class='content'> <div class='drawer-box'> " +
                "<div class='drawer-box-header mb--20' style='padding: 0 20px 27px 0'> <h2 class='drawer-box-title ml-10 isCom" + comIdx[i] + "' style='margin-bottom: 10px;'> " +
                "해당 댓글을 신고하시겠습니까?</h2></div></div> " +
                "<div class='drawer-box-footer'> <div class='btn-group'> <button class='btn btn-lg btn-red btn" + comIdx[i] + "' type='button'style='width: 100%'>신고하기</button></div> " +
                "</div></div></div></div></div>"
            $('.comReport').append(reportCom);
            $('.comDiv' + review).append(comment);
        }
    }

}

// 댓글 좋아요 여부 판단
function comHeart(comIdx, comHeartNum, isComLike, revComIdx, comPrIdx) {
    if (isComLike) {
        comHearting(comIdx, false, comHeartNum, revComIdx, comPrIdx);       // 좋아요 취소
    } else {
        comHearting(comIdx, true, comHeartNum, revComIdx, comPrIdx);
    }
}

// 댓글 좋아요 기능
function comHearting(comIdx, check, comHeartNum, revIdx, prIdx) {
    if (check) {
        console.log('❤️' + comHeartNum);
        let param = {"comIdx": comIdx, 'comLike': comHeartNum, 'prIdx': prIdx, "revIdx": revIdx};
        $.ajax({
            type: 'POST',
            data: JSON.stringify(param),
            url: "/timeline/new/comment/heart",
            contentType: "application/json",
            success: function (data) {
                console.log(data);
                let liked = "<span class='__like __on comLike" + comIdx + "'" +
                    "onclick='comHeart(" + comIdx + "," + comHeartNum + "," + true + "," + revIdx + "," + prIdx + ")'>"
                    + (data) + "</span>"
                $('.comLike' + comIdx).replaceWith(liked);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("ERROR : " + textStatus + " : " + errorThrown);
            }
        });
    } else {
        // 좋아요 취소
        console.log('💙' + comHeartNum);
        let del = {"comIdx": comIdx, 'comLike': comHeartNum, 'prIdx': prIdx, "revIdx": revIdx};
        $.ajax({
                type: 'POST',
                data: JSON.stringify(del),
                url: "/timeline/del/comment/heart",
                contentType: "application/json",
                success: function (data) {
                    console.log(data);
                    let unliked = "<span class='__like comLike" + comIdx + "'" +
                        "onclick='comHeart(" + comIdx + "," + comHeartNum + "," + false + "," + revIdx + "," + prIdx + ")'>"
                        + (data) + "</span>"
                    $('.comLike' + comIdx).replaceWith(unliked);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("ERROR : " + textStatus + " : " + errorThrown);
                }
            }
        )

    }
}

// 댓글 등록
function newCom(revIdx, prIdx) {
    let newPost = $('.newContent' + revIdx).val();
    let param = {"revIdx": revIdx, 'comContent': newPost, "prIdx": prIdx, "comLike": 0}
    $.ajax({
            type: 'POST',
            data: JSON.stringify(param),
            url: "/timeline/new/comment",
            contentType: "application/json",
            success: function (data) {
                console.log(data);
                alert('댓글 등록 성공!');
                // let com = list(data);
                // console.log(com);
                // let newCom = "<div class='__user-info'> " +
                //     "<a class='profile'> <div class='profile-pic'> " +
                //     "<img src='https://catchtable.co.kr/web-static/static_webapp_v2/img/noimg/profile_default_v2.png' class='img'" +
                //     "style='background: url(&quot;data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7&quot;) center center no-repeat transparent;'>" +
                //     " </div> " +
                //     "<h4 class='name username'>" +
                //     "<span class='txt'>" + com.comNick + "</span>" +
                //     "</h4> " +
                //     "<div class='__post-meta'> " +
                //     "<span class='__like comLike'>" + com.comLike + "</span> " +
                //     "</div> </a> </div> " +
                //     "<div class='__content'><p class='content'>" + com.comContent + "</p></div><div class='__post-meta'> " +
                //     "<span class='__date date' style='font-size: 13px;flex-direction: row-reverse;'>" + com.regDate + "</span> " +
                //     "<a class='__more del'>MORE</a></div>" +
                //     "<hr class='hairline'>";
                // $('.comDiv' + id).append(newCom);
                $('.comDiv' + id).load(location.href + '.comDiv' + id);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("ERROR : " + textStatus + " : " + errorThrown);
            }
        }
    )

}

