
module.exports = {
    index:function(title, list, body){
        return `<!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="../public/style.css">
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
    },
    page:function (param) {
        `<!DOCTYPE html>
        <html lang="ko">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="../public/style.css">
                <link href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.css" rel="stylesheet">
                <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.js"></script>
        
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
                        <li><a href="/">글쓰기</a></li>
                        <li><a href="/">관리</a></li>
                    </ul>
                </nav>
                <main>
                    <article>
                        <form method="post" action="/create_process">
                            <input type="text" name="title" placeholder="title">
                            <textarea id="summernote" name="editordata"></textarea>
                        
                            <script>
                                $(document).ready(function() {
                                    $('#summernote').summernote({
                                        placeholder: 'Hello stand alone ui',
                                        tabsize: 2,
                                        height: 120,
                                        toolbar: [
                                        ['style', ['style']],
                                        ['font', ['bold', 'underline', 'clear']],
                                        ['color', ['color']],
                                        ['para', ['ul', 'ol', 'paragraph']],
                                        ['table', ['table']],
                                        ['insert', ['link', 'picture', 'video']],
                                        ['view', ['fullscreen', 'codeview', 'help']]
                                        ]
                                    })
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
