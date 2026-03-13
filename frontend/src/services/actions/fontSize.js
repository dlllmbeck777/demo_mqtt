import $ from "jquery"

import ProfileService from "../api/profile"
export const applyFontSize = async () => {
    try {
        let res = await ProfileService.loadProfileSettings()
        $("html").css({ "font-size": `${res.data[0].font_size}px` })
    } catch {
        $("html").css({ "font-size": localStorage.getItem('fontsize') ? `${localStorage.getItem('fontsize')}px` : "14px" })
    }

}

export const applyFontWeight = async () => {
    try {
        let res = await ProfileService.loadProfileSettings()
        $(".drawer-menu__list-item__text").css({ "font-weight": parseInt(res.data[0].font_weight) })
        $(".treemenu-container__box__element-box__list__item > span").css({
            "font-weight": parseInt(res.data[0].font_weight),
        });
        $(".MuiTreeItem-label").css({
            "font-weight": parseInt(res.data[0].font_weight),
        });
        $(".tag-manager-container__body__property-box__prop-item__box__label").css({
            "font-weight": parseInt(res.data[0].font_weight),
        })
    } catch {
        $(".drawer-menu__list-item__text").css({
            "font-weight": localStorage.getItem('fontweight') ? localStorage.getItem('fontweight') : 400,
        });
        $(".treemenu-container__box__element-box__list__item > span").css({
            "font-weight": localStorage.getItem('fontweight') ? localStorage.getItem('fontweight') : 400,
        });
        $(".MuiTreeItem-label").css({
            "font-weight": localStorage.getItem('fontweight') ? localStorage.getItem('fontweight') : 400,
        });
        $(".tag-manager-container__body__property-box__prop-item__box__label").css({
            "font-weight": localStorage.getItem('fontweight') ? localStorage.getItem('fontweight') : 400,
        })
    }

}