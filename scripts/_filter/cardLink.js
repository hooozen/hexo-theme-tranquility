/* global hexo */

'use strict';

hexo.extend.filter.register('after_post_render', (data) => {
    data.content = data.content.replace(
        /<cardLink[\s]*link="([a-zA-Z]*:\/\/[^"]*)"[\s]*>([\s\S]*)<\/cardLink>/g,
        `<div><a target="_blank" href="$1" style="position: relative; display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; box-sizing: border-box; -webkit-flex-direction: row; -ms-flex-direction: row; flex-direction: row; -webkit-align-items: center; -webkit-box-align: center; -ms-flex-align: center; align-items: center; width: 390px; max-width: 90%; min-height: 88px; border-radius: 8px; overflow: hidden; margin: 16px auto; padding: 8px 12px 6px 12px; background-color: #f6f6f6; text-decoration:none;"><div><div style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: visible; text-overflow: ellipsis; font-size: 90%; max-height: 55%; line-height: 1.25; color: #121212;">$2</div><div style="display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; font-size: 65%; height: 16px; max-height: 4%; line-height: 16px; margin-top: 2%; color: #999;"><div style="display: inline-flex; align-items: center;"><svg class="link" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>$1</div></div></div></a></div>`
    );
    return data;
});