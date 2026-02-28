// ==UserScript==
// @name         CodemaoUserDB 社区集成插件（编程猫昵称搜索）
// @namespace    https://userdb.hachimlab.top/
// @version      1.0
// @description  社区没有按昵称找人的功能？来使用这个插件！
// @author       HachimLab
// @match        https://shequ.codemao.cn/discover*
// @match        https://shequ.codemao.cn/user/*
// @grant        GM_xmlhttpRequest
// @connect      udbapi.hachimlab.top
// @icon         https://hachimlab.top/favicon.ico
// ==/UserScript==

(function() {
    'use strict';

    // ==============================
    // 首次使用提示
    // ==============================

    const firstUseKey = "codemao_userdb_first_use_notice";

    if (!localStorage.getItem(firstUseKey)) {
        alert(
`欢迎使用 CodemaoUserDB 社区集成插件！这个提示只会在第一次使用时弹出~
本插件将会无感记录/更新用户ID信息，仅在打开个人页面时进行记录
部分用户信息未记录，关于技术细节，请打开GitHub仓库查看
给我们一个Star：https://github.com/hachimlab/UserDB
============
By HachimLab（哈基米实验室） | https://hachimlab.top/`
        );
        localStorage.setItem(firstUseKey, "true");
    }

    // ==============================
    // 发现页功能（用户搜索）
    // ==============================

    if (location.href.includes("/discover")) {

        function removePopup() {
            const popup = document.getElementById('notices');
            if (popup) {
                popup.remove();
            }
        }

        function addSearchBox() {
            const container = document.querySelector('.r-discover--search-box');
            if (!container) return;

            if (container.querySelector('.custom-user-search')) return;

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = '搜索用户';
            input.className = 'custom-user-search';

            input.style.border = '1px solid #e5e5e5';
            input.style.borderRadius = '4px';
            input.style.padding = '6px 12px';
            input.style.lineHeight = '18px';
            input.style.color = '#333';
            input.style.width = '220px';
            input.style.marginLeft = '8px';

            container.appendChild(input);

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const keyword = input.value.trim();
                    if (keyword) {
                        searchUsers(keyword);
                    }
                }
            });
        }

        function addExternalLink() {
            const switchBox = document.querySelector('.r-discover--switch-box');
            if (!switchBox) return;

            if (switchBox.querySelector('.custom-userdb-link')) return;

            const listItem = document.createElement('li');
            listItem.className = 'custom-userdb-link';
            listItem.style.marginLeft = '20px';
            listItem.style.padding = '0 8px';
            listItem.style.cursor = 'pointer';

            const link = document.createElement('a');
            link.href = 'https://userdb.hachimlab.top/';
            link.target = '_blank';
            link.textContent = 'Codemao UserDB';
            link.style.color = '#fec433';
            link.style.fontWeight = '500';
            link.style.fontSize = '16px';
            link.style.textDecoration = 'none';
            link.style.transition = 'color 0.2s ease';

            link.addEventListener('mouseenter', () => {
                link.style.color = '#ffbb10';
            });

            link.addEventListener('mouseleave', () => {
                link.style.color = '#fec433';
            });

            listItem.appendChild(link);
            switchBox.appendChild(listItem);
        }

        async function searchUsers(keyword) {
            const worksSection = document.querySelector('.r-discover--works-section');
            if (!worksSection) return;

            const currentUrl = window.location.href;
            sessionStorage.setItem('lastWorkSearchUrl', currentUrl);

            worksSection.innerHTML = '<div style="text-align: center; padding: 50px;">搜索中...</div>';

            try {
                const response = await fetch(`https://udbapi.hachimlab.top/search?nickname=${encodeURIComponent(keyword)}`);

                if (response.status === 404) {
                    showEmptyResult(keyword, worksSection);
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.status === 'ok' && data.items && data.items.length > 0) {
                    displayUserResults(data, keyword, worksSection);
                } else {
                    showEmptyResult(keyword, worksSection);
                }
            } catch (error) {
                console.error('搜索用户出错:', error);
                worksSection.innerHTML = `<div style="text-align: center; padding: 50px; color: red;">搜索失败: ${error.message}<br>请检查网络连接或稍后重试</div>`;
            }
        }

        function showEmptyResult(keyword, worksSection) {
            worksSection.innerHTML = `
                <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; padding: 0 10px;">
                    <div style="font-size: 16px; color: #333;">
                        为你找到"${escapeHtml(keyword)}"相关的用户共 0 个
                    </div>
                    <button id="backToWorkSearch" style="
                        padding: 6px 12px;
                        background: #fec433;
                        border: none;
                        border-radius: 4px;
                        color: #fff;
                        cursor: pointer;
                        font-size: 14px;
                        transition: background-color 0.2s ease;
                    ">返回作品搜索</button>
                </div>
            `;

            const backButton = document.getElementById('backToWorkSearch');
            if (backButton) {
                backButton.addEventListener('mouseenter', () => {
                    backButton.style.backgroundColor = '#ffbb10';
                });
                backButton.addEventListener('mouseleave', () => {
                    backButton.style.backgroundColor = '#fec433';
                });
                backButton.addEventListener('click', () => {
                    const lastUrl = sessionStorage.getItem('lastWorkSearchUrl');
                    if (lastUrl) {
                        window.location.href = lastUrl;
                    } else {
                        window.location.href = 'https://shequ.codemao.cn/discover';
                    }
                });
            }
        }

        function displayUserResults(data, keyword, worksSection) {
            const items = data.items;
            const total = data.user || items.length;

            let html = `
                <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; padding: 0 10px;">
                    <div style="font-size: 16px; color: #333;">
                        为你找到"${escapeHtml(keyword)}"相关的用户共 ${total} 个
                    </div>
                    <button id="backToWorkSearch" style="
                        padding: 6px 12px;
                        background: #fec433;
                        border: none;
                        border-radius: 4px;
                        color: #fff;
                        cursor: pointer;
                        font-size: 14px;
                        transition: background-color 0.2s ease;
                    ">返回作品搜索</button>
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 40px;">
            `;

            items.forEach(user => {
                const userId = user.id;
                html += `
                    <div class="event_target data_report r-discover--work-item" style="cursor: pointer; width: 220px; margin: 0;" onclick="window.open('https://shequ.codemao.cn/user/${userId}', '_blank')">
                        <div class="r-discover-c-workcard--work_item_wrap">
                            <div class="r-discover-c-workcard--work_item">
                                <div class="r-discover-c-workcard--work_img_wrap">
                                    <span class="r-discover-c-workcard--work_img" style="background-image: url('${escapeHtml(user.avatar || 'https://static.codemao.cn/avatar/default/v1_user_008.png')}');"></span>
                                </div>
                                <div class="r-discover-c-workcard--work_detail" style="padding-bottom: 15px;">
                                    <h5 class="r-discover-c-workcard--work_name">${escapeHtml(user.nickname)}</h5>
                                    <div style="color: #666; font-size: 14px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; min-height: 20px;">
                                        ${escapeHtml(user.description || '这个人很懒，什么都没写~')}
                                    </div>
                                    <p class="r-discover-c-workcard--author" style="margin-top: 10px; padding-top: 0; margin-bottom: 0;">
                                        <a target="_blank" href="https://shequ.codemao.cn/user/${userId}" style="color: #999; font-size: 13px; text-decoration: none; transition: color 0.2s ease;">用户ID: ${userId}</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });

            html += `</div>`;
            worksSection.innerHTML = html;

            const backButton = document.getElementById('backToWorkSearch');
            if (backButton) {
                backButton.addEventListener('mouseenter', () => {
                    backButton.style.backgroundColor = '#ffbb10';
                });
                backButton.addEventListener('mouseleave', () => {
                    backButton.style.backgroundColor = '#fec433';
                });
                backButton.addEventListener('click', () => {
                    const lastUrl = sessionStorage.getItem('lastWorkSearchUrl');
                    if (lastUrl) {
                        window.location.href = lastUrl;
                    } else {
                        window.location.href = 'https://shequ.codemao.cn/discover';
                    }
                });
            }
        }

        function escapeHtml(unsafe) {
            if (!unsafe) return '';
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

        function init() {
            removePopup();
            addSearchBox();
            addExternalLink();
        }

        window.addEventListener('load', function() {
            setTimeout(init, 500);
        });
    }

    // ==============================
    // 用户页 UID 自动同步
    // ==============================

    if (location.href.includes("/user/")) {

        const THROTTLE_TIME = 10 * 60 * 1000;

        const match = window.location.pathname.match(/\/user\/(\d+)/);
        if (!match) return;

        const uid = match[1];
        const now = Date.当前();
        const storageKey = `codemao_uid_${uid}`;
        const lastTime = localStorage.getItem(storageKey);

        if (lastTime && (当前 - parseInt(lastTime, 10)) < THROTTLE_TIME) {
            return;
        }

        const originalTitle = document.title;

        function tempTitle(text) {
            document.title = text;
            setTimeout(() => {
                document.title = originalTitle;
            }, 1000);
        }

        const updateUrl = `https://udbapi.hachimlab.top/user/update?id=${uid}`;
        const addUrl = `https://udbapi.hachimlab.top/user/add?id=${uid}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: updateUrl,
            onload: function(response) {

                if (response.status === 404) {

                    GM_xmlhttpRequest({
                        method: "GET",
                        url: addUrl,
                        onload: function(addResponse) {
                            if (addResponse.status === 200) {
                                localStorage.setItem(storageKey, now.toString());
                                tempTitle("已记录此用户信息");
                            }
                        }
                    });

                } else {

                    localStorage.setItem(storageKey, now.toString());
                    tempTitle("已更新此用户信息");
                }
            }
        });
    }

})();
