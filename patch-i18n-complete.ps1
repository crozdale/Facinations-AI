# patch-i18n-complete.ps1
# Patches public/locales/<lang>/translation.json for all 12 languages
# Adds missing keys found in hardcoded strings across all components
# Run from: C:\Users\crozd\musee-crosdale

$root = "C:\Users\crozd\musee-crosdale\public\locales"

# ── New keys to inject per language ──────────────────────────────────────────
# Each entry is: namespace.key => [en, fr, de, es, it, pt-BR, ru, zh-CN, ja, ko, ar, hi]

$newKeys = [ordered]@{

  # TeleportViewer
  "teleport.enter_space"        = @("Enter space","Entrer","Betreten","Entrar","Entra","Entrar","Войти","进入","入る","입장","دخول","प्रवेश करें")
  "teleport.exit_space"         = @("Exit space","Quitter","Verlassen","Salir","Esci","Sair","Выйти","退出","退出","나가기","خروج","बाहर निकलें")
  "teleport.idle"               = @("idle","inactif","inaktiv","inactivo","inattivo","inativo","ожидание","空闲","待機","대기","خامل","निष्क्रिय")
  "teleport.ready"              = @("ready","prêt","bereit","listo","pronto","pronto","готово","就绪","準備完了","준비","جاهز","तैयार")
  "teleport.loading"            = @("Loading…","Chargement…","Laden…","Cargando…","Caricamento…","Carregando…","Загрузка…","加载中…","読み込み中…","로딩 중…","جارٍ التحميل…","लोड हो रहा है…")
  "teleport.scene_unavailable"  = @("Scene unavailable","Scène indisponible","Szene nicht verfügbar","Escena no disponible","Scena non disponibile","Cena indisponível","Сцена недоступна","场景不可用","シーンが利用できません","장면을 사용할 수 없습니다","المشهد غير متاح","दृश्य उपलब्ध नहीं")
  "teleport.splats"             = @("splats","splats","Splats","splats","splats","splats","сплатов","个点","スプラット","스플랫","نقاط","स्प्लैट्स")
  "teleport.varjo"              = @("Varjo Teleport","Varjo Teleport","Varjo Teleport","Varjo Teleport","Varjo Teleport","Varjo Teleport","Varjo Teleport","Varjo Teleport","Varjo Teleport","Varjo 텔레포트","Varjo Teleport","Varjo Teleport")
  "teleport.immersive_3d"       = @("3D Immersive","Immersif 3D","3D Immersiv","3D Inmersivo","3D Immersivo","3D Imersivo","3D Иммерсив","3D 沉浸式","3D イマーシブ","3D 몰입형","ثلاثي الأبعاد","3D इमर्सिव")

  # GalleryPanel / GalleryCard
  "galleryPanel.view_on_xdale"  = @("View on XdaleGallery","Voir sur XdaleGallery","Auf XdaleGallery ansehen","Ver en XdaleGallery","Vedi su XdaleGallery","Ver no XdaleGallery","Смотреть на XdaleGallery","在 XdaleGallery 查看","XdaleGallery で見る","XdaleGallery에서 보기","عرض على XdaleGallery","XdaleGallery पर देखें")
  "galleryPanel.open_vault"     = @("Open Vault","Ouvrir le coffre","Tresor öffnen","Abrir bóveda","Apri cassaforte","Abrir cofre","Открыть хранилище","打开金库","ボルトを開く","볼트 열기","فتح الخزنة","वॉल्ट खोलें")
  "galleryPanel.watch_doc"      = @("Watch Artist Documentary","Regarder le documentaire","Dokumentarfilm ansehen","Ver documental","Guarda il documentario","Assistir documentário","Смотреть документальный фильм","观看艺术家纪录片","ドキュメンタリーを見る","다큐멘터리 보기","مشاهدة الفيلم الوثائقي","डॉक्यूमेंट्री देखें")
  "galleryPanel.hide_doc"       = @("Hide","Masquer","Ausblenden","Ocultar","Nascondi","Ocultar","Скрыть","隐藏","非表示","숨기기","إخفاء","छुपाएं")

  # FractionPanel
  "fractionPanel.title"              = @("Fractional Ownership","Propriété fractionnelle","Bruchteilseigentum","Propiedad fraccionada","Proprietà frazionata","Propriedade fracionada","Дробное владение","部分所有权","分数所有権","분할 소유","ملكية جزئية","आंशिक स्वामित्व")
  "fractionPanel.fractions_label"    = @("Fractions","Fractions","Bruchteile","Fracciones","Frazioni","Frações","Дроби","碎片","フラクション","분할","كسور","भिन्न")
  "fractionPanel.total"              = @("Total Fractions","Total des fractions","Gesamtbruchteile","Total de fracciones","Totale frazioni","Total de frações","Всего дробей","总碎片","合計フラクション","총 분할","إجمالي الكسور","कुल भिन्न")
  "fractionPanel.available"          = @("Available","Disponible","Verfügbar","Disponible","Disponibile","Disponível","Доступно","可用","利用可能","사용 가능","متاح","उपलब्ध")
  "fractionPanel.price_per"          = @("Price / Fraction","Prix / Fraction","Preis / Bruchteil","Precio / Fracción","Prezzo / Frazione","Preço / Fração","Цена / Дробь","价格 / 碎片","価格 / フラクション","가격 / 분할","السعر / كسر","मूल्य / भिन्न")
  "fractionPanel.token_id"           = @("Token ID","ID du jeton","Token-ID","ID de token","ID token","ID do token","ID токена","代币 ID","トークン ID","토큰 ID","معرّف الرمز","टोकन ID")
  "fractionPanel.your_balance"       = @("Your Balance","Votre solde","Ihr Guthaben","Su saldo","Il tuo saldo","Seu saldo","Ваш баланс","您的余额","残高","잔액","رصيدك","आपकी शेष राशि")
  "fractionPanel.fractions_owned"    = @("fractions","fractions","Bruchteile","fracciones","frazioni","frações","дробей","碎片","フラクション","분할","كسور","भिन्न")
  "fractionPanel.connect_prompt"     = @("Connect your wallet to view your fraction balance.","Connectez votre portefeuille pour voir votre solde.","Verbinden Sie Ihre Wallet, um Ihr Guthaben zu sehen.","Conecte su cartera para ver su saldo.","Collega il tuo portafoglio per vedere il tuo saldo.","Conecte sua carteira para ver seu saldo.","Подключите кошелёк для просмотра баланса.","连接钱包以查看您的碎片余额。","残高を確認するためにウォレットを接続してください。","잔액을 보려면 지갑을 연결하세요.","قم بتوصيل محفظتك لرؤية رصيدك.","अपना शेष देखने के लिए वॉलेट कनेक्ट करें।")
  "fractionPanel.acquire"            = @("Acquire Fractions","Acquérir des fractions","Bruchteile erwerben","Adquirir fracciones","Acquisisci frazioni","Adquirir frações","Приобрести дроби","获取碎片","フラクションを取得","분할 취득","الحصول على كسور","भिन्न प्राप्त करें")
  "fractionPanel.transfer"           = @("Transfer","Transférer","Übertragen","Transferir","Trasferisci","Transferir","Перевести","转移","転送","전송","نقل","स्थानांतरण")
  "fractionPanel.full_name"          = @("Full Name","Nom complet","Vollständiger Name","Nombre completo","Nome completo","Nome completo","Полное имя","全名","フルネーム","전체 이름","الاسم الكامل","पूरा नाम")
  "fractionPanel.email_required"     = @("Email *","Email *","E-Mail *","Email *","Email *","Email *","Email *","电子邮件 *","メール *","이메일 *","البريد الإلكتروني *","ईमेल *")
  "fractionPanel.fractions_req"      = @("Fractions Requested *","Fractions demandées *","Gewünschte Bruchteile *","Fracciones solicitadas *","Frazioni richieste *","Frações solicitadas *","Запрошенных дробей *","请求的碎片 *","リクエストするフラクション *","요청 분할 *","الكسور المطلوبة *","अनुरोधित भिन्न *")
  "fractionPanel.indicative_total"   = @("Indicative total:","Total indicatif :","Indikativer Gesamtbetrag:","Total indicativo:","Totale indicativo:","Total indicativo:","Ориентировочный итог:","参考总计：","目安合計：","예상 합계:","المجموع التقريبي:","सांकेतिक कुल:")
  "fractionPanel.message_opt"        = @("Message (optional)","Message (facultatif)","Nachricht (optional)","Mensaje (opcional)","Messaggio (facoltativo)","Mensagem (opcional)","Сообщение (необязательно)","留言（可选）","メッセージ（任意）","메시지 (선택)","رسالة (اختياري)","संदेश (वैकल्पिक)")
  "fractionPanel.submit_enquiry"     = @("Submit Enquiry","Soumettre la demande","Anfrage senden","Enviar consulta","Invia richiesta","Enviar consulta","Отправить запрос","提交询问","問い合わせを送信","문의 제출","إرسال الاستفسار","जांच सबमिट करें")
  "fractionPanel.submitting"         = @("Submitting…","Envoi…","Wird gesendet…","Enviando…","Invio…","Enviando…","Отправка…","提交中…","送信中…","제출 중…","جارٍ الإرسال…","सबमिट हो रहा है…")
  "fractionPanel.enquiry_submitted"  = @("Enquiry submitted. A curator will be in touch within two business days.","Demande soumise. Un conservateur vous contactera sous deux jours ouvrables.","Anfrage eingereicht. Ein Kurator wird sich innerhalb von zwei Werktagen melden.","Consulta enviada. Un curador se pondrá en contacto en dos días hábiles.","Richiesta inviata. Un curatore ti contatterà entro due giorni lavorativi.","Consulta enviada. Um curador entrará em contato em dois dias úteis.","Запрос отправлен. Куратор свяжется с вами в течение двух рабочих дней.","询问已提交。策展人将在两个工作日内与您联系。","問い合わせを送信しました。キュレーターが2営業日以内にご連絡します。","문의가 제출되었습니다. 큐레이터가 2영업일 이내에 연락드립니다.","تم إرسال الاستفسار. سيتواصل معك أحد القيّمين خلال يومين عمل.","पूछताछ सबमिट की गई। एक क्यूरेटर दो कार्य दिवसों के भीतर संपर्क करेगा।")
  "fractionPanel.recipient"          = @("Recipient Address *","Adresse du destinataire *","Empfängeradresse *","Dirección del destinatario *","Indirizzo destinatario *","Endereço do destinatário *","Адрес получателя *","收件人地址 *","受取人アドレス *","수신자 주소 *","عنوان المستلم *","प्राप्तकर्ता पता *")
  "fractionPanel.quantity"           = @("Quantity *","Quantité *","Menge *","Cantidad *","Quantità *","Quantidade *","Количество *","数量 *","数量 *","수량 *","الكمية *","मात्रा *")
  "fractionPanel.max_label"          = @("Max:","Max :","Max:","Máx:","Max:","Máx:","Макс:","最大：","最大：","최대:","الحد الأقصى:","अधिकतम:")
  "fractionPanel.transfer_onchain"   = @("Transfer On-Chain","Transférer on-chain","On-Chain übertragen","Transferir on-chain","Trasferisci on-chain","Transferir on-chain","Перевести on-chain","链上转移","オンチェーン転送","온체인 전송","نقل على السلسلة","ऑन-चेन ट्रांसफर")
  "fractionPanel.awaiting"           = @("Awaiting confirmation…","En attente de confirmation…","Warte auf Bestätigung…","Esperando confirmación…","In attesa di conferma…","Aguardando confirmação…","Ожидание подтверждения…","等待确认…","確認待ち…","확인 대기 중…","في انتظار التأكيد…","पुष्टि की प्रतीक्षा में…")
  "fractionPanel.transfer_confirmed" = @("Transfer confirmed.","Transfert confirmé.","Übertragung bestätigt.","Transferencia confirmada.","Trasferimento confermato.","Transferência confirmada.","Перевод подтверждён.","转移已确认。","転送が確認されました。","전송 확인되었습니다.","تم تأكيد النقل.","स्थानांतरण की पुष्टि हुई।")
  "fractionPanel.view_etherscan"     = @("View on Etherscan ↗","Voir sur Etherscan ↗","Auf Etherscan ansehen ↗","Ver en Etherscan ↗","Vedi su Etherscan ↗","Ver no Etherscan ↗","Смотреть на Etherscan ↗","在 Etherscan 查看 ↗","Etherscan で見る ↗","Etherscan에서 보기 ↗","عرض على Etherscan ↗","Etherscan पर देखें ↗")
  "fractionPanel.reset"              = @("Reset","Réinitialiser","Zurücksetzen","Restablecer","Ripristina","Redefinir","Сбросить","重置","リセット","초기화","إعادة تعيين","रीसेट")
  "fractionPanel.acquire_notice"     = @("Fraction acquisition is a curated process. Submit your expression of interest and our team will complete the on-chain transfer after verification.","L'acquisition de fractions est un processus curatif. Soumettez votre intérêt et notre équipe effectuera le transfert après vérification.","Der Fraktionserwerb ist ein kuratierter Prozess. Senden Sie Ihr Interesse und unser Team wird die Übertragung nach der Überprüfung abschließen.","La adquisición de fracciones es un proceso curado. Envíe su interés y nuestro equipo completará la transferencia tras la verificación.","L'acquisizione di frazioni è un processo curato. Invia la tua manifestazione di interesse e il nostro team completerà il trasferimento dopo la verifica.","A aquisição de frações é um processo curado. Envie seu interesse e nossa equipe concluirá a transferência após verificação.","Приобретение дробей — курируемый процесс. Отправьте заявку, и наша команда завершит перевод после проверки.","碎片收购是一个精心策划的过程。提交您的意向，我们的团队将在验证后完成链上转移。","フラクションの取得はキュレーションされたプロセスです。申し込みを提出してください。検証後にチームが転送を完了します。","분할 취득은 큐레이션된 프로세스입니다. 관심을 제출하면 팀이 검증 후 온체인 전송을 완료합니다.","اقتناء الكسور عملية منظمة. أرسل طلبك وسيكمل فريقنا التحويل بعد التحقق.","भिन्न अधिग्रहण एक क्यूरेटेड प्रक्रिया है। अपनी रुचि सबमिट करें और हमारी टीम सत्यापन के बाद ऑन-चेन ट्रांसफर पूरा करेगी।")
  "fractionPanel.transfer_notice"    = @("Transfer fractions to another wallet via ERC1155 safeTransferFrom. Ensure your wallet is connected to Sepolia.","Transférez des fractions vers un autre portefeuille via ERC1155 safeTransferFrom. Assurez-vous d'être connecté à Sepolia.","Übertragen Sie Bruchteile über ERC1155 safeTransferFrom. Stellen Sie sicher, dass Ihre Wallet mit Sepolia verbunden ist.","Transfiera fracciones a otra cartera mediante ERC1155 safeTransferFrom. Asegúrese de estar conectado a Sepolia.","Trasferisci frazioni a un altro portafoglio tramite ERC1155 safeTransferFrom. Assicurati di essere connesso a Sepolia.","Transfira frações para outra carteira via ERC1155 safeTransferFrom. Certifique-se de estar conectado ao Sepolia.","Переведите дроби на другой кошелёк через ERC1155 safeTransferFrom. Убедитесь, что кошелёк подключён к Sepolia.","通过 ERC1155 safeTransferFrom 将碎片转移到另一个钱包。确保您的钱包已连接到 Sepolia。","ERC1155 safeTransferFrom を介してフラクションを別のウォレットに転送します。Sepolia に接続していることを確認してください。","ERC1155 safeTransferFrom을 통해 다른 지갑으로 분할을 전송합니다. Sepolia에 연결되어 있는지 확인하세요.","انقل الكسور إلى محفظة أخرى عبر ERC1155 safeTransferFrom. تأكد من اتصال محفظتك بـ Sepolia.","ERC1155 safeTransferFrom के माध्यम से भिन्न को किसी अन्य वॉलेट में स्थानांतरित करें। सुनिश्चित करें कि आपका वॉलेट Sepolia से जुड़ा है।")

  # GovernancePanel
  "governance.title"             = @("Governance","Gouvernance","Governance","Gobernanza","Governance","Governança","Управление","治理","ガバナンス","거버넌스","الحوكمة","शासन")
  "governance.register_vault"    = @("Register Vault","Enregistrer le coffre","Tresor registrieren","Registrar bóveda","Registra cassaforte","Registrar cofre","Зарегистрировать хранилище","注册金库","ボルトを登録","볼트 등록","تسجيل الخزنة","वॉल्ट पंजीकृत करें")
  "governance.vault_id_ph"       = @("Vault ID","ID du coffre","Tresor-ID","ID de bóveda","ID cassaforte","ID do cofre","ID хранилища","金库 ID","ボルト ID","볼트 ID","معرّف الخزنة","वॉल्ट ID")
  "governance.vault_contract_ph" = @("Vault Contract","Contrat de coffre","Tresor-Vertrag","Contrato de bóveda","Contratto cassaforte","Contrato do cofre","Контракт хранилища","金库合约","ボルトコントラクト","볼트 컨트랙트","عقد الخزنة","वॉल्ट अनुबंध")
  "governance.swap_contract_ph"  = @("Swap Contract","Contrat de swap","Swap-Vertrag","Contrato de swap","Contratto swap","Contrato de swap","Своп-контракт","交换合约","スワップコントラクト","스왑 컨트랙트","عقد المبادلة","स्वैप अनुबंध")
  "governance.premium_required"  = @("Premium Required","Premium requis","Premium erforderlich","Premium requerido","Premium richiesto","Premium necessário","Требуется Premium","需要高级版","プレミアム必須","프리미엄 필요","مطلوب مميز","प्रीमियम आवश्यक")
  "governance.register_btn"      = @("Register Vault","Enregistrer le coffre","Tresor registrieren","Registrar bóveda","Registra cassaforte","Registrar cofre","Зарегистрировать","注册金库","登録","등록","تسجيل","पंजीकृत करें")
  "governance.emergency"         = @("Emergency Controls","Contrôles d'urgence","Notfallsteuerungen","Controles de emergencia","Controlli di emergenza","Controles de emergência","Экстренное управление","紧急控制","緊急制御","비상 제어","ضوابط الطوارئ","आपातकालीन नियंत्रण")
  "governance.pause"             = @("Pause Protocol","Mettre en pause","Protokoll pausieren","Pausar protocolo","Metti in pausa","Pausar protocolo","Приостановить протокол","暂停协议","プロトコルを一時停止","프로토콜 일시 중지","إيقاف البروتوكول مؤقتاً","प्रोटोकॉल रोकें")
  "governance.unpause"           = @("Unpause Protocol","Reprendre","Fortsetzen","Reanudar","Riprendi","Retomar","Возобновить","恢复","再開","다시 시작","استئناف البروتوكول","प्रोटोकॉल फिर शुरू करें")

  # LegalViewer
  "legalViewer.title"            = @("Legal Documentation","Documentation juridique","Rechtsdokumentation","Documentación legal","Documentazione legale","Documentação legal","Правовая документация","法律文件","法的文書","법적 문서","الوثائق القانونية","कानूनी दस्तावेज़")
  "legalViewer.view_pdf"         = @("View Signed PDF","Voir le PDF signé","Signiertes PDF ansehen","Ver PDF firmado","Visualizza PDF firmato","Ver PDF assinado","Смотреть подписанный PDF","查看已签署 PDF","署名済み PDF を見る","서명된 PDF 보기","عرض PDF الموقّع","हस्ताक्षरित PDF देखें")
  "legalViewer.doc_hash"         = @("Document Hash:","Hachage du document :","Dokumenthash:","Hash del documento:","Hash documento:","Hash do documento:","Хэш документа:","文件哈希：","ドキュメントハッシュ：","문서 해시:","تجزئة المستند:","दस्तावेज़ हैश:")

  # VAultLegalSection
  "vaultLegal.summary_title"     = @("Legal Summary","Résumé juridique","Rechtliche Zusammenfassung","Resumen legal","Riepilogo legale","Resumo legal","Правовое резюме","法律摘要","法的概要","법적 요약","ملخص قانوني","कानूनी सारांश")
  "vaultLegal.revenue_only"      = @("Revenue Participation Only","Participation aux revenus uniquement","Nur Gewinnbeteiligung","Solo participación en ingresos","Solo partecipazione ai ricavi","Apenas participação na receita","Только участие в доходах","仅收益参与","収益参加のみ","수익 참여만","مشاركة في الإيرادات فقط","केवल राजस्व भागीदारी")
  "vaultLegal.statement"         = @("Owner retains legal title and physical possession of the artwork. Vault tokens represent contractual economic and governance interests only.","Le propriétaire conserve le titre légal et la possession physique de l'œuvre. Les jetons de coffre représentent uniquement des intérêts économiques et de gouvernance contractuels.","Der Eigentümer behält den rechtlichen Titel und den physischen Besitz des Kunstwerks. Vault-Token repräsentieren nur vertragliche wirtschaftliche und Governance-Interessen.","El propietario conserva el título legal y la posesión física de la obra. Los tokens de bóveda representan únicamente intereses económicos y de gobernanza contractuales.","Il proprietario mantiene il titolo legale e il possesso fisico dell'opera. I token vault rappresentano solo interessi economici e di governance contrattuali.","O proprietário mantém o título legal e a posse física da obra. Os tokens do cofre representam apenas interesses econômicos e de governança contratuais.","Владелец сохраняет законный титул и физическое владение произведением. Токены хранилища представляют только договорные экономические интересы и права управления.","所有者保留艺术品的法律所有权和实物占有权。金库代币仅代表合同经济和治理权益。","所有者は芸術作品の法的所有権と物理的占有権を保持します。ボルトトークンは契約上の経済的および統治上の利益のみを表します。","소유자는 예술 작품의 법적 소유권과 물리적 점유를 유지합니다. 볼트 토큰은 계약상 경제적 및 거버넌스 이익만을 나타냅니다.","يحتفظ المالك بالملكية القانونية والحيازة الفعلية للعمل الفني. تمثل رموز الخزنة مصالح اقتصادية وحوكمة تعاقدية فقط.","मालिक कलाकृति का कानूनी शीर्षक और भौतिक कब्जा बनाए रखता है। वॉल्ट टोकन केवल अनुबंधात्मक आर्थिक और शासन हितों का प्रतिनिधित्व करते हैं।")
  "vaultLegal.no_ownership"      = @("No ownership, custody, or possessory rights","Aucun droit de propriété, de garde ou de possession","Keine Eigentums-, Verwaltungs- oder Besitzrechte","Sin derechos de propiedad, custodia o posesión","Nessun diritto di proprietà, custodia o possesso","Sem direitos de propriedade, custódia ou posse","Никаких прав собственности, хранения или владения","无所有权、托管权或占有权","所有権、管理権、占有権なし","소유권, 관리권, 점유권 없음","لا حقوق ملكية أو حضانة أو حيازة","कोई स्वामित्व, हिरासत, या अधिकारी अधिकार नहीं")
  "vaultLegal.no_copyright"      = @("No copyright or intellectual property rights","Aucun droit d'auteur ni droit de propriété intellectuelle","Keine Urheber- oder Eigentumsrechte","Sin derechos de autor ni propiedad intelectual","Nessun diritto d'autore o di proprietà intellettuale","Sem direitos autorais ou propriedade intelectual","Никаких авторских или интеллектуальных прав","无版权或知识产权","著作権または知的財産権なし","저작권 또는 지적 재산권 없음","لا حقوق طبع ونشر أو ملكية فكرية","कोई कॉपीराइट या बौद्धिक संपदा अधिकार नहीं")
  "vaultLegal.no_force_sale"     = @("No right to force sale or access the artwork","Aucun droit de forcer la vente ou d'accéder à l'œuvre","Kein Recht zur Zwangsveräußerung oder zum Zugang zum Kunstwerk","Sin derecho a forzar la venta o acceder a la obra","Nessun diritto di forzare la vendita o accedere all'opera","Sem direito de forçar venda ou acessar a obra","Нет права на принудительную продажу или доступ к произведению","无权强制出售或访问艺术品","強制売却または芸術作品へのアクセス権なし","강제 판매 또는 예술 작품 접근 권한 없음","لا حق في إجبار البيع أو الوصول إلى العمل الفني","बिक्री या कलाकृति तक पहुँचने के लिए बाध्य करने का कोई अधिकार नहीं")
  "vaultLegal.third_party"       = @("Custody and insurance maintained by third parties","Garde et assurance maintenues par des tiers","Verwahrung und Versicherung durch Dritte","Custodia y seguro mantenidos por terceros","Custodia e assicurazione mantenute da terzi","Custódia e seguro mantidos por terceiros","Хранение и страхование обеспечивают третьи стороны","托管和保险由第三方维护","保管と保険は第三者が管理","보관 및 보험은 제3자가 유지","الحضانة والتأمين تحتفظ بهما أطراف ثالثة","हिरासत और बीमा तृतीय पक्षों द्वारा बनाए रखा जाता है")
  "vaultLegal.blockchain_only"   = @("Blockchain records are evidentiary only","Les enregistrements blockchain sont uniquement probatoires","Blockchain-Aufzeichnungen sind nur Beweismittel","Los registros blockchain son solo evidencia","I record blockchain sono solo evidenziali","Os registros blockchain são apenas evidenciais","Записи блокчейна носят только доказательный характер","区块链记录仅作为证据","ブロックチェーン記録は証拠のみ","블록체인 기록은 증거 목적만","سجلات البلوكشين للأدلة فقط","ब्लॉकचेन रिकॉर्ड केवल साक्ष्यात्मक हैं")
  "vaultLegal.hide_summary"      = @("Hide legal summary","Masquer le résumé","Zusammenfassung ausblenden","Ocultar resumen","Nascondi riepilogo","Ocultar resumo","Скрыть резюме","隐藏摘要","概要を非表示","요약 숨기기","إخفاء الملخص","सारांश छुपाएं")
  "vaultLegal.view_summary"      = @("View legal summary","Voir le résumé","Zusammenfassung ansehen","Ver resumen","Visualizza riepilogo","Ver resumo","Показать резюме","查看摘要","概要を表示","요약 보기","عرض الملخص","सारांश देखें")
  "vaultLegal.view_legal_pack"   = @("View Legal Pack","Voir le pack juridique","Rechtspaket ansehen","Ver paquete legal","Visualizza pacchetto legale","Ver pacote legal","Смотреть правовой пакет","查看法律包","法的パックを見る","법적 패키지 보기","عرض الحزمة القانونية","कानूनी पैकेज देखें")
  "vaultLegal.governing_law"     = @("Governing Law:","Droit applicable :","Anwendbares Recht:","Ley aplicable:","Legge applicabile:","Lei aplicável:","Применимое право:","适用法律：","準拠法：","준거법:","القانون الحاكم:","शासी कानून:")
  "vaultLegal.vault_id"          = @("Vault ID:","ID du coffre :","Tresor-ID:","ID de bóveda:","ID cassaforte:","ID do cofre:","ID хранилища:","金库 ID：","ボルト ID：","볼트 ID:","معرّف الخزنة:","वॉल्ट ID:")

  # VaultList
  "vaultList.title"              = @("Vaults","Coffres","Tresore","Bóvedas","Casseforti","Cofres","Хранилища","金库","ボルト","볼트","الخزائن","वॉल्ट")
  "vaultList.locked"             = @("Locked","Verrouillé","Gesperrt","Bloqueado","Bloccato","Bloqueado","Заблокировано","已锁定","ロック済み","잠김","مقفل","बंद")
  "vaultList.open_vault"         = @("Open Vault","Ouvrir le coffre","Tresor öffnen","Abrir bóveda","Apri cassaforte","Abrir cofre","Открыть","打开金库","開く","열기","فتح الخزنة","खोलें")

  # MainLayout
  "mainLayout.home"              = @("Home","Accueil","Startseite","Inicio","Home","Início","Главная","首页","ホーム","홈","الرئيسية","होम")
  "mainLayout.swap"              = @("Swap","Échange","Tauschen","Intercambio","Scambia","Troca","Обмен","兑换","スワップ","스왑","مبادلة","स्वैप")

  # Premium page
  "premium.ledger_title"         = @("Premium Access Ledger","Registre d'accès premium","Premium-Zugangsregister","Registro de acceso premium","Registro accesso premium","Registro de acesso premium","Реестр доступа Premium","高级访问账本","プレミアムアクセス台帳","프리미엄 액세스 원장","سجل الوصول المميز","प्रीमियम एक्सेस लेजर")
  "premium.address"              = @("Address:","Adresse :","Adresse:","Dirección:","Indirizzo:","Endereço:","Адрес:","地址：","アドレス：","주소:","العنوان:","पता:")
  "premium.paid"                 = @("Paid:","Payé :","Bezahlt:","Pagado:","Pagato:","Pago:","Оплачено:","已支付：","支払い済み：","결제:","مدفوع:","भुगतान:")
  "premium.time"                 = @("Time:","Heure :","Zeit:","Hora:","Ora:","Hora:","Время:","时间：","時間：","시간:","الوقت:","समय:")

  # Vault page (old)
  "vaultPage.loading"            = @("Loading…","Chargement…","Laden…","Cargando…","Caricamento…","Carregando…","Загрузка…","加载中…","読み込み中…","로딩 중…","جارٍ التحميل…","लोड हो रहा है…")
  "vaultPage.not_found"          = @("Vault not found","Coffre introuvable","Tresor nicht gefunden","Bóveda no encontrada","Cassaforte non trovata","Cofre não encontrado","Хранилище не найдено","未找到金库","ボルトが見つかりません","볼트를 찾을 수 없습니다","لم يتم العثور على الخزنة","वॉल्ट नहीं मिला")

  # VVVaults
  "vvvaults.not_found_title"     = @("Vault Not Found","Coffre introuvable","Tresor nicht gefunden","Bóveda no encontrada","Cassaforte non trovata","Cofre não encontrado","Хранилище не найдено","未找到金库","ボルトが見つかりません","볼트를 찾을 수 없습니다","لم يتم العثور على الخزنة","वॉल्ट नहीं मिला")
  "vvvaults.not_registered"      = @("This vault is not registered in the Canonical Vault Registry.","Ce coffre n'est pas enregistré dans le Registre canonique des coffres.","Dieser Tresor ist nicht im Kanonischen Tresorregister registriert.","Esta bóveda no está registrada en el Registro Canónico de Bóvedas.","Questa cassaforte non è registrata nel Registro Canonico dei Vault.","Este cofre não está registrado no Registro de Cofres Canônico.","Это хранилище не зарегистрировано в Каноническом реестре хранилищ.","此金库未在规范金库注册表中注册。","このボルトは正規ボルトレジストリに登録されていません。","이 볼트는 표준 볼트 레지스트리에 등록되지 않았습니다.","هذه الخزنة غير مسجلة في سجل الخزائن القانوني.","यह वॉल्ट कैनोनिकल वॉल्ट रजिस्ट्री में पंजीकृत नहीं है।")
  "vvvaults.readonly_status"     = @("Status: Public Read-Only Mode. This vault is visible for review and verification only.","Statut : Mode lecture seule public. Ce coffre est visible uniquement pour révision et vérification.","Status: Öffentlicher Nur-Lese-Modus. Dieser Tresor ist nur zur Überprüfung sichtbar.","Estado: Modo de solo lectura público. Esta bóveda es visible solo para revisión y verificación.","Stato: Modalità sola lettura pubblica. Questo vault è visibile solo per revisione e verifica.","Status: Modo somente leitura público. Este cofre é visível apenas para revisão e verificação.","Статус: Публичный режим только для чтения. Хранилище доступно только для просмотра и проверки.","状态：公共只读模式。此金库仅供审查和验证。","ステータス：パブリック読み取り専用モード。このボルトはレビューと検証のみに表示されます。","상태: 공개 읽기 전용 모드. 이 볼트는 검토 및 확인 목적으로만 표시됩니다.","الحالة: وضع القراءة فقط العام. هذه الخزنة مرئية للمراجعة والتحقق فقط.","स्थिति: सार्वजनिक केवल-पढ़ने का मोड। यह वॉल्ट केवल समीक्षा और सत्यापन के लिए दृश्यमान है।")
  "vvvaults.marketplace_status"  = @("Status: Marketplace Active. Eligible actions may be available for this vault.","Statut : Marché actif. Des actions éligibles peuvent être disponibles pour ce coffre.","Status: Marktplatz aktiv. Für diesen Tresor können geeignete Aktionen verfügbar sein.","Estado: Mercado activo. Es posible que haya acciones elegibles disponibles para esta bóveda.","Stato: Marketplace attivo. Potrebbero essere disponibili azioni idonee per questo vault.","Status: Marketplace ativo. Ações elegíveis podem estar disponíveis para este cofre.","Статус: Рынок активен. Для этого хранилища могут быть доступны соответствующие действия.","状态：市场已激活。此金库可能有符合条件的操作。","ステータス：マーケットプレイス稼働中。このボルトに適切なアクションが利用可能な場合があります。","상태: 마켓플레이스 활성. 이 볼트에 적합한 작업이 가능할 수 있습니다.","الحالة: السوق نشط. قد تكون الإجراءات المؤهلة متاحة لهذه الخزنة.","स्थिति: मार्केटप्लेस सक्रिय। इस वॉल्ट के लिए पात्र कार्रवाई उपलब्ध हो सकती है।")
  "vvvaults.artwork_section"     = @("Artwork","Œuvre d'art","Kunstwerk","Obra de arte","Opera d'arte","Obra de arte","Произведение искусства","艺术品","アートワーク","예술 작품","عمل فني","कलाकृति")
  "vvvaults.legal_section"       = @("Legal Documentation","Documentation juridique","Rechtsdokumentation","Documentación legal","Documentazione legale","Documentação legal","Правовая документация","法律文件","法的文書","법적 문서","الوثائق القانونية","कानूनी दस्तावेज़")
  "vvvaults.legal_desc"          = @("The following legal documentation governs this vault.","La documentation juridique suivante régit ce coffre.","Die folgende rechtliche Dokumentation regelt diesen Tresor.","La siguiente documentación legal rige esta bóveda.","La seguente documentazione legale disciplina questo vault.","A seguinte documentação legal rege este cofre.","Следующая правовая документация регулирует это хранилище.","以下法律文件管理此金库。","以下の法的文書がこのボルトを管理します。","다음 법적 문서가 이 볼트를 관리합니다.","تحكم هذه الخزنة الوثائق القانونية التالية.","निम्नलिखित कानूनी दस्तावेज़ इस वॉल्ट को नियंत्रित करते हैं।")
  "vvvaults.view_legal_pack"     = @("View Legal Pack","Voir le pack juridique","Rechtspaket ansehen","Ver paquete legal","Visualizza pacchetto legale","Ver pacote legal","Смотреть правовой пакет","查看法律包","法的パックを見る","법적 패키지 보기","عرض الحزمة القانونية","कानूनी पैकेज देखें")
  "vvvaults.chain_section"       = @("On-Chain Binding","Liaison on-chain","On-Chain-Bindung","Vinculación on-chain","Legame on-chain","Vinculação on-chain","Привязка on-chain","链上绑定","オンチェーンバインディング","온체인 바인딩","الربط على السلسلة","ऑन-चेन बाइंडिंग")
  "vvvaults.network"             = @("Network:","Réseau :","Netzwerk:","Red:","Rete:","Rede:","Сеть:","网络：","ネットワーク：","네트워크:","الشبكة:","नेटवर्क:")
  "vvvaults.vault_contract"      = @("Vault Contract:","Contrat de coffre :","Tresor-Vertrag:","Contrato de bóveda:","Contratto cassaforte:","Contrato do cofre:","Контракт хранилища:","金库合约：","ボルトコントラクト：","볼트 컨트랙트:","عقد الخزنة:","वॉल्ट अनुबंध:")
  "vvvaults.not_deployed"        = @("Not yet deployed","Pas encore déployé","Noch nicht bereitgestellt","Aún no desplegado","Non ancora distribuito","Ainda não implantado","Ещё не развёрнут","尚未部署","まだ展開されていません","아직 배포되지 않음","لم يتم نشره بعد","अभी तक तैनात नहीं")
  "vvvaults.mint_section"        = @("Mint Fractional Interests","Émettre des intérêts fractionnels","Bruchteilsanteile prägen","Acuñar intereses fraccionados","Conia interessi frazionati","Cunhar interesses fracionados","Выпустить дробные доли","铸造部分权益","分数権益をミント","분할 이익 발행","سك الحصص الجزئية","आंशिक हित बनाएं")
  "vvvaults.mint_notice"         = @("Minting constitutes acquisition of a fractional interest governed by the attached legal documentation.","L'émission constitue l'acquisition d'un intérêt fractionnel régi par la documentation juridique ci-jointe.","Das Prägen stellt den Erwerb eines Bruchteilsanteils dar, der durch die beigefügte Rechtsdokumentation geregelt wird.","La acuñación constituye la adquisición de un interés fraccionado regido por la documentación legal adjunta.","La coniazione costituisce l'acquisizione di un interesse frazionato disciplinato dalla documentazione legale allegata.","A cunhagem constitui aquisição de um interesse fracionado regido pela documentação legal em anexo.","Минтинг означает приобретение дробной доли, регулируемой прилагаемой правовой документацией.","铸造构成按附带法律文件管理的部分权益的收购。","ミントは添付の法的文書によって管理される分数権益の取得を構成します。","발행은 첨부 법적 문서에 의해 관리되는 분할 이익의 취득을 구성합니다.","يُعدّ سك العملة اقتناءً لحصة جزئية تحكمها الوثائق القانونية المرفقة.","मिंटिंग संलग्न कानूनी दस्तावेज़ीकरण द्वारा शासित आंशिक ब्याज के अधिग्रहण का गठन करती है।")
  "vvvaults.mint_btn"            = @("Mint","Émettre","Prägen","Acuñar","Conia","Cunhar","Выпустить","铸造","ミント","발행","سك","मिंट")

  # Dashboard hardcoded strings
  "dashboard.protocol_eyebrow"   = @("Facinations Protocol","Facinations Protocol","Facinations Protocol","Facinations Protocol","Facinations Protocol","Facinations Protocol","Facinations Protocol","Facinations Protocol","Facinations Protocol","Facinations Protocol","Facinations Protocol","Facinations Protocol")
  "dashboard.subgraph_notice"    = @("On-chain data is temporarily unavailable — the subgraph may be syncing. Wallet balances and status are unaffected.","Les données on-chain sont temporairement indisponibles — le sous-graphe est peut-être en synchronisation. Les soldes et statuts de portefeuille ne sont pas affectés.","On-Chain-Daten sind vorübergehend nicht verfügbar — der Subgraph wird möglicherweise synchronisiert. Wallet-Guthaben und -Status sind nicht betroffen.","Los datos on-chain no están disponibles temporalmente: el subgrafo puede estar sincronizándose. Los saldos y el estado de la cartera no se ven afectados.","I dati on-chain sono temporaneamente non disponibili: il subgraph potrebbe essere in sincronizzazione. I saldi e lo stato del portafoglio non sono interessati.","Os dados on-chain estão temporariamente indisponíveis — o subgraph pode estar sincronizando. Saldos e status da carteira não são afetados.","Данные on-chain временно недоступны — субграф может синхронизироваться. Балансы кошелька и статус не затронуты.","链上数据暂时不可用 — 子图可能正在同步。钱包余额和状态不受影响。","オンチェーンデータは一時的に利用できません — サブグラフが同期中の可能性があります。ウォレット残高とステータスには影響しません。","온체인 데이터를 일시적으로 사용할 수 없습니다 — 서브그래프가 동기화 중일 수 있습니다. 지갑 잔액 및 상태에는 영향이 없습니다.","البيانات على السلسلة غير متاحة مؤقتاً — قد يكون الرسم الفرعي قيد المزامنة. أرصدة المحفظة والحالة غير متأثرة.","ऑन-चेन डेटा अस्थायी रूप से अनुपलब्ध है — सबग्राफ सिंक हो रहा हो सकता है। वॉलेट बैलेंस और स्थिति प्रभावित नहीं हैं।")
  "dashboard.collector_intel"    = @("Collector Intelligence","Intelligence collecteur","Sammlernachricht","Inteligencia del coleccionista","Intelligence collezionista","Inteligência do colecionador","Коллекционная аналитика","收藏家情报","コレクター インテリジェンス","컬렉터 인텔리전스","ذكاء المجمّع","कलेक्टर इंटेलिजेंस")
  "dashboard.ask_sia"            = @("Ask SIA about your portfolio, strategy, or fractional ownership.","Demandez à SIA votre portefeuille, stratégie ou propriété fractionnelle.","Fragen Sie SIA nach Ihrem Portfolio, Ihrer Strategie oder Bruchteilseigentum.","Pregúntele a SIA sobre su cartera, estrategia o propiedad fraccionada.","Chiedi a SIA del tuo portafoglio, strategia o proprietà frazionata.","Pergunte à SIA sobre seu portfólio, estratégia ou propriedade fracionada.","Спросите SIA о вашем портфеле, стратегии или дробном владении.","向 SIA 询问您的投资组合、策略或部分所有权。","SIA にポートフォリオ、戦略、または分数所有権について質問してください。","SIA에게 포트폴리오, 전략 또는 분할 소유에 대해 물어보세요.","اسأل SIA عن محفظتك أو استراتيجيتك أو الملكية الجزئية.","SIA से अपने पोर्टफोलियो, रणनीति या आंशिक स्वामित्व के बारे में पूछें।")
  "dashboard.community_portal"   = @("Community Portal","Portail communautaire","Community-Portal","Portal comunitario","Portale community","Portal comunitário","Портал сообщества","社区门户","コミュニティポータル","커뮤니티 포털","بوابة المجتمع","सामुदायिक पोर्टल")

  # Gallery hardcoded
  "gallery.ai_subtitle"          = @("AI Curator — Analysing artwork","IA Curateur — Analyse de l'œuvre","KI-Kurator — Kunstwerk analysieren","Curador IA — Analizando obra","Curatore IA — Analisi opera","Curador IA — Analisando obra","ИИ-куратор — Анализ произведения","AI 策展人 — 分析艺术品","AI キュレーター — 作品分析","AI 큐레이터 — 작품 분석","قيّم ذكاء اصطناعي — تحليل العمل","AI क्यूरेटर — कलाकृति का विश्लेषण")

  # Swap hardcoded
  "swap.protocol_eyebrow"        = @("Facinations Protocol","Facinations Protocol","Facinations Protocol","Facinations Protocol","Facinations Protocol","Facinations Protocol","Facinations Protocol","Facinations Protocol","Facinations Protocol","Facinations Protocol","Facinations Protocol","Facinations Protocol")

  # DealerIntelligencePanel
  "dealerIntel.eyebrow"          = @("Facinations · SIA","Facinations · SIA","Facinations · SIA","Facinations · SIA","Facinations · SIA","Facinations · SIA","Facinations · SIA","Facinations · SIA","Facinations · SIA","Facinations · SIA","Facinations · SIA","Facinations · SIA")
  "dealerIntel.title"            = @("Dealer Intelligence","Intelligence du revendeur","Händler-Intelligenz","Inteligencia del distribuidor","Intelligence rivenditore","Inteligência do revendedor","Дилерская аналитика","经销商情报","ディーラー インテリジェンス","딜러 인텔리전스","ذكاء المتعامل","डीलर इंटेलिजेंस")
  "dealerIntel.subtitle"         = @("AI partner for gallery owners, dealer principals, and collectors.","Partenaire IA pour les propriétaires de galeries, directeurs de galeries et collectionneurs.","KI-Partner für Galeriebesitzer, Händlerleiter und Sammler.","Socio de IA para propietarios de galerías, directores de distribuidores y coleccionistas.","Partner IA per proprietari di gallerie, direttori di dealer e collezionisti.","Parceiro IA para proprietários de galerias, diretores de revendedores e colecionadores.","ИИ-партнёр для владельцев галерей, дилеров и коллекционеров.","画廊所有者、经销商负责人和收藏家的 AI 合作伙伴。","ギャラリーオーナー、ディーラー責任者、コレクター向けAIパートナー。","갤러리 소유자, 딜러 책임자 및 컬렉터를 위한 AI 파트너.","شريك الذكاء الاصطناعي لأصحاب الصالات وكبار المتعاملين والجامعين.","गैलरी मालिकों, डीलर प्रमुखों और कलेक्टरों के लिए AI भागीदार।")
  "dealerIntel.placeholder"      = @("Ask about inventory strategy, XER economics, provenance…","Posez une question sur la stratégie d'inventaire, l'économie XER, la provenance…","Fragen Sie nach Inventarstrategie, XER-Ökonomie, Provenienz…","Pregunta sobre estrategia de inventario, economía XER, procedencia…","Chiedi della strategia di inventario, economia XER, provenienza…","Pergunte sobre estratégia de inventário, economia XER, procedência…","Спросите о стратегии инвентаря, экономике XER, провенансе…","询问库存策略、XER 经济学、来源…","在庫戦略、XER 経済学、来歴について質問してください…","재고 전략, XER 경제학, 출처에 대해 물어보세요…","اسأل عن استراتيجية المخزون وأقتصاديات XER والمصدر…","इन्वेंट्री रणनीति, XER अर्थशास्त्र, उत्पत्ति के बारे में पूछें…")
  "dealerIntel.send"             = @("Send","Envoyer","Senden","Enviar","Invia","Enviar","Отправить","发送","送信","전송","إرسال","भेजें")
}

$langs = @("en","fr","de","es","it","pt-BR","ru","zh-CN","ja","ko","ar","hi")
$langIndex = @{ en=0; fr=1; de=2; es=3; it=4; "pt-BR"=5; ru=6; "zh-CN"=7; ja=8; ko=9; ar=10; hi=11 }

foreach ($lang in $langs) {
    $file = "$root\$lang\translation.json"
    if (-not (Test-Path $file)) {
        Write-Host "SKIP (not found): $lang" -ForegroundColor Yellow
        continue
    }

    $json = Get-Content $file -Raw -Encoding UTF8
    $obj  = $json | ConvertFrom-Json

    $idx = $langIndex[$lang]
    $changed = $false

    foreach ($fullKey in $newKeys.Keys) {
        $parts = $fullKey -split "\."
        $ns    = $parts[0]
        $key   = $parts[1]
        $val   = $newKeys[$fullKey][$idx]

        # Ensure namespace exists
        if (-not ($obj.PSObject.Properties.Name -contains $ns)) {
            $obj | Add-Member -NotePropertyName $ns -NotePropertyValue ([PSCustomObject]@{})
        }

        $nsObj = $obj.$ns

        # Only add if key is missing
        if (-not ($nsObj.PSObject.Properties.Name -contains $key)) {
            $nsObj | Add-Member -NotePropertyName $key -NotePropertyValue $val
            $changed = $true
        }
    }

    if ($changed) {
        $updated = $obj | ConvertTo-Json -Depth 10 -Compress:$false
        [System.IO.File]::WriteAllText($file, $updated, [System.Text.Encoding]::UTF8)
        Write-Host "PATCHED: $lang" -ForegroundColor Green
    } else {
        Write-Host "SKIP (already up to date): $lang" -ForegroundColor Cyan
    }
}

Write-Host "`nDone. Rebuild with: pnpm build" -ForegroundColor White
