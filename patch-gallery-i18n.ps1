# patch-gallery-i18n.ps1
# Adds missing gallery keys to all 12 public/locales translation.json files
# Run from any directory: .\patch-gallery-i18n.ps1

$root = "C:\Users\crozd\musee-crosdale\public\locales"

$blocks = @{

"en" = @'
  "gallery": {
    "speed": "Speed",
    "title": "Musée-Crosdale",
    "eyebrow": "Musée-Crosdale — Original Works",
    "subtitle": "A curated collection of fine art with on-chain provenance.",
    "works_count": "{{count}} works",
    "filter_all": "All",
    "filter_derain": "Derain",
    "filter_matisse": "Matisse",
    "filter_medieval": "Medieval",
    "filter_renaissance": "Renaissance",
    "filter_originals": "Originals",
    "zoom_hint": "Scroll or pinch to zoom",
    "zoom_reset": "Reset zoom",
    "royalty": "Royalty: {{percent}}%",
    "curators_eye": "Curator's Eye",
    "btn_invoke": "Ask the Curator",
    "btn_retry": "Try Again",
    "ai_error": "Unable to reach the curator right now.",
    "ai_thinking": "Curating a response…",
    "placeholder_ask": "Ask about this artwork…",
    "related_works": "Related Works",
    "immersive_label": "Enter immersive space",
    "btn_enter_space": "Enter space",
    "hypsoverse": "View in Hypsoverse",
    "vimeo": "Watch on Vimeo"
  }
'@

"fr" = @'
  "gallery": {
    "speed": "Vitesse",
    "title": "Musée-Crosdale",
    "eyebrow": "Musée-Crosdale — Œuvres Originales",
    "subtitle": "Une collection d'art raffinée avec provenance on-chain.",
    "works_count": "{{count}} œuvres",
    "filter_all": "Tout",
    "filter_derain": "Derain",
    "filter_matisse": "Matisse",
    "filter_medieval": "Médiéval",
    "filter_renaissance": "Renaissance",
    "filter_originals": "Originaux",
    "zoom_hint": "Faites défiler ou pincez pour zoomer",
    "zoom_reset": "Réinitialiser le zoom",
    "royalty": "Redevance : {{percent}}%",
    "curators_eye": "Œil du Commissaire",
    "btn_invoke": "Interroger le Commissaire",
    "btn_retry": "Réessayer",
    "ai_error": "Impossible de joindre le commissaire pour le moment.",
    "ai_thinking": "Élaboration d'une réponse…",
    "placeholder_ask": "Posez une question sur cette œuvre…",
    "related_works": "Œuvres associées",
    "immersive_label": "Entrer dans l'espace immersif",
    "btn_enter_space": "Entrer",
    "hypsoverse": "Voir dans Hypsoverse",
    "vimeo": "Regarder sur Vimeo"
  }
'@

"de" = @'
  "gallery": {
    "speed": "Geschwindigkeit",
    "title": "Musée-Crosdale",
    "eyebrow": "Musée-Crosdale — Originalwerke",
    "subtitle": "Eine kuratierte Kunstsammlung mit On-Chain-Provenienz.",
    "works_count": "{{count}} Werke",
    "filter_all": "Alle",
    "filter_derain": "Derain",
    "filter_matisse": "Matisse",
    "filter_medieval": "Mittelalter",
    "filter_renaissance": "Renaissance",
    "filter_originals": "Originale",
    "zoom_hint": "Scrollen oder zoomen",
    "zoom_reset": "Zoom zurücksetzen",
    "royalty": "Lizenzgebühr: {{percent}}%",
    "curators_eye": "Kuratorenblick",
    "btn_invoke": "Kurator befragen",
    "btn_retry": "Erneut versuchen",
    "ai_error": "Kurator derzeit nicht erreichbar.",
    "ai_thinking": "Antwort wird zusammengestellt…",
    "placeholder_ask": "Frage zu diesem Werk…",
    "related_works": "Verwandte Werke",
    "immersive_label": "Immersiven Raum betreten",
    "btn_enter_space": "Betreten",
    "hypsoverse": "In Hypsoverse ansehen",
    "vimeo": "Auf Vimeo ansehen"
  }
'@

"es" = @'
  "gallery": {
    "speed": "Velocidad",
    "title": "Musée-Crosdale",
    "eyebrow": "Musée-Crosdale — Obras Originales",
    "subtitle": "Una colección de arte curada con procedencia on-chain.",
    "works_count": "{{count}} obras",
    "filter_all": "Todo",
    "filter_derain": "Derain",
    "filter_matisse": "Matisse",
    "filter_medieval": "Medieval",
    "filter_renaissance": "Renacimiento",
    "filter_originals": "Originales",
    "zoom_hint": "Desplázate o pellizca para hacer zoom",
    "zoom_reset": "Restablecer zoom",
    "royalty": "Regalía: {{percent}}%",
    "curators_eye": "Ojo del Comisario",
    "btn_invoke": "Consultar al Comisario",
    "btn_retry": "Reintentar",
    "ai_error": "No se puede contactar al comisario en este momento.",
    "ai_thinking": "Elaborando una respuesta…",
    "placeholder_ask": "Pregunta sobre esta obra…",
    "related_works": "Obras relacionadas",
    "immersive_label": "Entrar al espacio inmersivo",
    "btn_enter_space": "Entrar",
    "hypsoverse": "Ver en Hypsoverse",
    "vimeo": "Ver en Vimeo"
  }
'@

"it" = @'
  "gallery": {
    "speed": "Velocità",
    "title": "Musée-Crosdale",
    "eyebrow": "Musée-Crosdale — Opere Originali",
    "subtitle": "Una collezione d'arte curata con provenienza on-chain.",
    "works_count": "{{count}} opere",
    "filter_all": "Tutto",
    "filter_derain": "Derain",
    "filter_matisse": "Matisse",
    "filter_medieval": "Medievale",
    "filter_renaissance": "Rinascimento",
    "filter_originals": "Originali",
    "zoom_hint": "Scorri o pizzica per ingrandire",
    "zoom_reset": "Ripristina zoom",
    "royalty": "Royalty: {{percent}}%",
    "curators_eye": "Occhio del Curatore",
    "btn_invoke": "Chiedi al Curatore",
    "btn_retry": "Riprova",
    "ai_error": "Impossibile contattare il curatore al momento.",
    "ai_thinking": "Elaborazione risposta…",
    "placeholder_ask": "Chiedi di quest'opera…",
    "related_works": "Opere correlate",
    "immersive_label": "Entra nello spazio immersivo",
    "btn_enter_space": "Entra",
    "hypsoverse": "Visualizza in Hypsoverse",
    "vimeo": "Guarda su Vimeo"
  }
'@

"pt-BR" = @'
  "gallery": {
    "speed": "Velocidade",
    "title": "Musée-Crosdale",
    "eyebrow": "Musée-Crosdale — Obras Originais",
    "subtitle": "Uma coleção de arte curada com proveniência on-chain.",
    "works_count": "{{count}} obras",
    "filter_all": "Tudo",
    "filter_derain": "Derain",
    "filter_matisse": "Matisse",
    "filter_medieval": "Medieval",
    "filter_renaissance": "Renascença",
    "filter_originals": "Originais",
    "zoom_hint": "Role ou faça pinça para ampliar",
    "zoom_reset": "Redefinir zoom",
    "royalty": "Royalty: {{percent}}%",
    "curators_eye": "Olhar do Curador",
    "btn_invoke": "Perguntar ao Curador",
    "btn_retry": "Tentar novamente",
    "ai_error": "Não foi possível contactar o curador agora.",
    "ai_thinking": "A elaborar uma resposta…",
    "placeholder_ask": "Pergunte sobre esta obra…",
    "related_works": "Obras relacionadas",
    "immersive_label": "Entrar no espaço imersivo",
    "btn_enter_space": "Entrar",
    "hypsoverse": "Ver no Hypsoverse",
    "vimeo": "Ver no Vimeo"
  }
'@

"ru" = @'
  "gallery": {
    "speed": "Скорость",
    "title": "Musée-Crosdale",
    "eyebrow": "Musée-Crosdale — Оригинальные работы",
    "subtitle": "Кураторская коллекция произведений искусства с on-chain провенансом.",
    "works_count": "{{count}} работ",
    "filter_all": "Все",
    "filter_derain": "Дерен",
    "filter_matisse": "Матисс",
    "filter_medieval": "Средневековье",
    "filter_renaissance": "Ренессанс",
    "filter_originals": "Оригиналы",
    "zoom_hint": "Прокрутите или сделайте жест щипка для зума",
    "zoom_reset": "Сбросить масштаб",
    "royalty": "Роялти: {{percent}}%",
    "curators_eye": "Взгляд куратора",
    "btn_invoke": "Спросить куратора",
    "btn_retry": "Повторить",
    "ai_error": "Куратор сейчас недоступен.",
    "ai_thinking": "Подготовка ответа…",
    "placeholder_ask": "Задайте вопрос об этой работе…",
    "related_works": "Похожие работы",
    "immersive_label": "Войти в иммерсивное пространство",
    "btn_enter_space": "Войти",
    "hypsoverse": "Смотреть в Hypsoverse",
    "vimeo": "Смотреть на Vimeo"
  }
'@

"zh-CN" = @'
  "gallery": {
    "speed": "速度",
    "title": "Musée-Crosdale",
    "eyebrow": "Musée-Crosdale — 原创作品",
    "subtitle": "精心策划的艺术收藏，具有链上溯源。",
    "works_count": "{{count}} 件作品",
    "filter_all": "全部",
    "filter_derain": "德兰",
    "filter_matisse": "马蒂斯",
    "filter_medieval": "中世纪",
    "filter_renaissance": "文艺复兴",
    "filter_originals": "原作",
    "zoom_hint": "滚动或捏合以缩放",
    "zoom_reset": "重置缩放",
    "royalty": "版税：{{percent}}%",
    "curators_eye": "策展人视角",
    "btn_invoke": "询问策展人",
    "btn_retry": "重试",
    "ai_error": "目前无法联系策展人。",
    "ai_thinking": "正在生成回复…",
    "placeholder_ask": "询问关于此作品的问题…",
    "related_works": "相关作品",
    "immersive_label": "进入沉浸式空间",
    "btn_enter_space": "进入",
    "hypsoverse": "在 Hypsoverse 中查看",
    "vimeo": "在 Vimeo 上观看"
  }
'@

"ja" = @'
  "gallery": {
    "speed": "スピード",
    "title": "Musée-Crosdale",
    "eyebrow": "Musée-Crosdale — オリジナル作品",
    "subtitle": "オンチェーン来歴を持つ厳選されたアートコレクション。",
    "works_count": "{{count}} 点の作品",
    "filter_all": "すべて",
    "filter_derain": "ドラン",
    "filter_matisse": "マティス",
    "filter_medieval": "中世",
    "filter_renaissance": "ルネサンス",
    "filter_originals": "オリジナル",
    "zoom_hint": "スクロールまたはピンチでズーム",
    "zoom_reset": "ズームをリセット",
    "royalty": "ロイヤリティ：{{percent}}%",
    "curators_eye": "キュレーターの目",
    "btn_invoke": "キュレーターに質問する",
    "btn_retry": "再試行",
    "ai_error": "現在キュレーターに接続できません。",
    "ai_thinking": "回答を作成中…",
    "placeholder_ask": "この作品について質問する…",
    "related_works": "関連作品",
    "immersive_label": "没入型スペースに入る",
    "btn_enter_space": "入る",
    "hypsoverse": "Hypsoverse で見る",
    "vimeo": "Vimeo で見る"
  }
'@

"ko" = @'
  "gallery": {
    "speed": "속도",
    "title": "Musée-Crosdale",
    "eyebrow": "Musée-Crosdale — 오리지널 작품",
    "subtitle": "온체인 출처를 갖춘 큐레이션된 미술 컬렉션.",
    "works_count": "{{count}}개 작품",
    "filter_all": "전체",
    "filter_derain": "드랭",
    "filter_matisse": "마티스",
    "filter_medieval": "중세",
    "filter_renaissance": "르네상스",
    "filter_originals": "오리지널",
    "zoom_hint": "스크롤하거나 핀치하여 확대",
    "zoom_reset": "확대 초기화",
    "royalty": "로열티: {{percent}}%",
    "curators_eye": "큐레이터의 눈",
    "btn_invoke": "큐레이터에게 묻기",
    "btn_retry": "다시 시도",
    "ai_error": "현재 큐레이터에 연결할 수 없습니다.",
    "ai_thinking": "응답 생성 중…",
    "placeholder_ask": "이 작품에 대해 질문하세요…",
    "related_works": "관련 작품",
    "immersive_label": "몰입형 공간 입장",
    "btn_enter_space": "입장",
    "hypsoverse": "Hypsoverse에서 보기",
    "vimeo": "Vimeo에서 보기"
  }
'@

"ar" = @'
  "gallery": {
    "speed": "السرعة",
    "title": "Musée-Crosdale",
    "eyebrow": "Musée-Crosdale — أعمال أصلية",
    "subtitle": "مجموعة فنية منسقة مع مصدر على السلسلة.",
    "works_count": "{{count}} عمل",
    "filter_all": "الكل",
    "filter_derain": "ديران",
    "filter_matisse": "ماتيس",
    "filter_medieval": "العصور الوسطى",
    "filter_renaissance": "عصر النهضة",
    "filter_originals": "الأصليات",
    "zoom_hint": "مرر أو اضغط للتكبير",
    "zoom_reset": "إعادة ضبط التكبير",
    "royalty": "عائد: {{percent}}%",
    "curators_eye": "عين القيّم",
    "btn_invoke": "اسأل القيّم",
    "btn_retry": "حاول مجدداً",
    "ai_error": "تعذّر الوصول إلى القيّم في الوقت الحالي.",
    "ai_thinking": "جارٍ إعداد رد…",
    "placeholder_ask": "اسأل عن هذا العمل…",
    "related_works": "أعمال ذات صلة",
    "immersive_label": "الدخول إلى الفضاء الغامر",
    "btn_enter_space": "دخول",
    "hypsoverse": "عرض في Hypsoverse",
    "vimeo": "مشاهدة على Vimeo"
  }
'@

"hi" = @'
  "gallery": {
    "speed": "गति",
    "title": "Musée-Crosdale",
    "eyebrow": "Musée-Crosdale — मूल कृतियाँ",
    "subtitle": "ऑन-चेन उत्पत्ति के साथ एक क्यूरेटेड कला संग्रह।",
    "works_count": "{{count}} कृतियाँ",
    "filter_all": "सभी",
    "filter_derain": "देरें",
    "filter_matisse": "मातिस",
    "filter_medieval": "मध्यकालीन",
    "filter_renaissance": "पुनर्जागरण",
    "filter_originals": "मूल",
    "zoom_hint": "ज़ूम करने के लिए स्क्रॉल करें या पिंच करें",
    "zoom_reset": "ज़ूम रीसेट करें",
    "royalty": "रॉयल्टी: {{percent}}%",
    "curators_eye": "क्यूरेटर की नज़र",
    "btn_invoke": "क्यूरेटर से पूछें",
    "btn_retry": "पुनः प्रयास करें",
    "ai_error": "अभी क्यूरेटर से संपर्क नहीं हो पा रहा।",
    "ai_thinking": "उत्तर तैयार हो रहा है…",
    "placeholder_ask": "इस कृति के बारे में पूछें…",
    "related_works": "संबंधित कृतियाँ",
    "immersive_label": "इमर्सिव स्पेस में प्रवेश करें",
    "btn_enter_space": "प्रवेश करें",
    "hypsoverse": "Hypsoverse में देखें",
    "vimeo": "Vimeo पर देखें"
  }
'@

}

$langs = @("en","fr","de","es","it","pt-BR","ru","zh-CN","ja","ko","ar","hi")

foreach ($lang in $langs) {
    $file = "$root\$lang\translation.json"
    if (-not (Test-Path $file)) {
        Write-Host "SKIP (not found): $file" -ForegroundColor Yellow
        continue
    }

    $content = Get-Content $file -Raw -Encoding UTF8

    # Check if gallery block already has more than just "speed"
    if ($content -match '"btn_invoke"') {
        Write-Host "SKIP (already patched): $lang" -ForegroundColor Cyan
        continue
    }

    # Replace the minimal gallery block with full block
    $oldBlock = '"gallery": \{[^}]*\}'
    $newBlock = $blocks[$lang].Trim()

    # Use regex to replace existing gallery block
    $updated = [regex]::Replace($content, '"gallery":\s*\{[^}]*\}', $newBlock)

    # Write back
    [System.IO.File]::WriteAllText($file, $updated, [System.Text.Encoding]::UTF8)
    Write-Host "PATCHED: $lang" -ForegroundColor Green
}

Write-Host "`nDone. Rebuild the app to pick up changes." -ForegroundColor White
