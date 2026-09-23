@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 오늘 사대 - GitHub 올리기
where git >nul 2>nul || (echo [!] 이 PC에 git 이 없습니다. https://git-scm.com 설치 후 다시 실행하세요. & pause & exit /b 1)

if not exist ".git" (
  echo [1/2] 처음 한 번: 이 폴더를 GitHub 저장소 gwanak-sadae 와 연결합니다...
  git init >nul
  git checkout -B main >nul 2>nul
  git remote add origin https://github.com/heyjune3737/gwanak-sadae.git
  git fetch origin main || (echo [!] 저장소에 접속하지 못했습니다. 인터넷/로그인 확인 & pause & exit /b 1)
  git reset origin/main >nul
  git branch --set-upstream-to=origin/main main >nul
  echo     연결 완료
)

echo [2/2] 바뀐 파일 올리는 중...
git add -A
git commit -m "업데이트 %date% %time%" >nul 2>nul
git pull --rebase origin main
git push origin main && (echo. & echo ===== 완료! 1~2분 뒤 https://heyjune3737.github.io/gwanak-sadae/ 에 반영됩니다 =====) || (echo. & echo [!] 올리기 실패 - 위 메시지를 캡처해서 보여 주세요)
echo.
pause
