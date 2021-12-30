var mysql      = require('mysql');
var db = require('../model/db');

module.exports = {
    HTML:function(title, list, body, control){
        return `<!DOCTYPE html>
        <html lang="ko">
        <head>
    <link rel="stylesheet" type="text/css" href="/css/style.css"">
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="lang/summernote-ko-KR.js"></script>
            <link rel="stylesheet" href="css/style.css">
            <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
            <link href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.css" rel="stylesheet">
            <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.js"></script>
            <title>${title}</title>
        </head>
        <body>
            <header>
                <img src="" alt="로고">
                <h1>${title}</h1>
                <a href="/login_process">로그인</a>
            </header>
            <nav>
                <ul>
                    <li><a href="/">홈</a></li>
                    <li><a href="/create">글쓰기</a></li>
                    <li><a href="/board">관리</a></li>
                </ul>
            </nav>
            <main>
                <article>
                    ${list}
                    ${control}
                    ${body}
                </article>
                <aside>
                    광고
                </aside>
            </main>
            <footer>
                만든사람과 연락처
            </footer>
        </body>
        </html>`
    },LIST:function (results) {
        var list = '<ul>';
        var i = 0;
        while(i < results.length){
        list = list + `<li><a href="/page/${results[i].id}">${results[i].title}</a></li>`;
        i++;
        }   
    list = list+'</ul>';
    return list;      
    },TABLE:function (results) {
        var tag = '<table>';
        var i = 0;
        while(i < results.length){
        tag += `<tr>
        <td>${results[i].id}</td>
        <td><a href="/page/${results[i].id}">${results[i].title}</a></td>
        <td>${results[i].created}</a></td>
        <td>${results[i].author_id}</td>
        </tr>
        `;
        i++;
    }   
    tag += '</table>';
    return tag;     
}
,

    page:function () {
        return`<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="lang/summernote-ko-KR.js"></script>
                <link rel="stylesheet" href="css/style.css">
                <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
                <link href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.css" rel="stylesheet">
                <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.js"></script>

                

        
                <title>글쓰기</title>
            </head>
            <body>
                <header>
                    <img href="/" src="" alt="로고">
                    <h1>마감일기</h1>
                    <a href="/login_process">로그인</a>
                </header>
                <nav>
                    <ul>
                        <li><a href="/">홈</a></li>
                        <li><a href="/create">글쓰기</a></li>
                        <li><a href="/">관리</a></li>
                    </ul>
                </nav>
                <main>
                    <article>
                        <form method="post" action="/create_process">
                            <input type="text" name="title" placeholder="title">
                            <textarea id="summernote" name="description"></textarea>
                            <script>
                                $(document).ready(function() {
                                    $('#summernote').summernote({
                                    lang: 'ko-KR' // default: 'en-US'
                                    });
                                });
                            </script>                     
                            <p><input type="submit" value="마감"></p>  
                        </form>
                                   
                    </article>
                    <aside>
                        광고
                        <table>
                            <thead>
                                <th>번호</th>
                                <th>제목</th>
                                <th>작가</th>
                                <th>마감시간</th>
                            </thead>
                            <tbody>
                                <td>a</td>
                                <td>s</td>
                                <td>f</td>
                                <td>v</td>
                            </tbody>
                            <tfoot>
                                <td colspan="4"><< < 12345 > >></td>
                            </tfoot>
                        </table>
        
                    </aside>
                </main>
                <footer>
                    만든사람과 연락처
                </footer>
            </body>
        </html>` 
      },pageResults:function (results) {
        return`<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="lang/summernote-ko-KR.js"></script>
                <link rel="stylesheet" href="css/style.css">
                <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
                <link href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.css" rel="stylesheet">
                <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.js"></script>

                

        
                <title>글쓰기</title>
            </head>
            <body>
                <header>
                    <img href="/" src="" alt="로고">
                    <h1>마감일기</h1>
                    <a href="/login_process">로그인</a>
                </header>
                <nav>
                    <ul>
                        <li><a href="/">홈</a></li>
                        <li><a href="/create">글쓰기</a></li>
                        <li><a href="/">관리</a></li>
                    </ul>
                </nav>
                <main>
                    <article>
                        <form method="post" action="/create_process">
                            <input type="text" name="title" placeholder="${results.title}">
                            <textarea id="summernote" name="description">${results.description}</textarea>
                            <script>
                                $(document).ready(function() {
                                    $('#summernote').summernote({
                                    lang: 'ko-KR' // default: 'en-US'
                                    });
                                });
                            </script>                     
                            <p><input type="submit" value="마감"></p>  
                        </form>
                                   
                    </article>
                    <aside>
                        광고
                        <table>
                            <thead>
                                <th>번호</th>
                                <th>제목</th>
                                <th>작가</th>
                                <th>마감시간</th>
                            </thead>
                            <tbody>
                                <td>a</td>
                                <td>s</td>
                                <td>f</td>
                                <td>v</td>
                            </tbody>
                            <tfoot>
                                <td colspan="4"><< < 12345 > >></td>
                            </tfoot>
                        </table>
        
                    </aside>
                </main>
                <footer>
                    만든사람과 연락처
                </footer>
            </body>
        </html>` 
      }


}   
