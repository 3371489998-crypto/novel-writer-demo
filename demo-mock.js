/* Demo Mock API — 模拟 Electron IPC 层，所有 AI 调用返回预设演示内容 */

(function () {
  const DEMO_DELAY = 800; // 模拟 API 延迟
  const CHUNK_DELAY = 40; // 流式输出每块延迟

  /* ── 预设响应数据库 ── */
  const MOCK_RESPONSES = {
    // 章节正文生成 — 展示番茄小说格式
    chapter: [
      "空气里开始弥漫一股刺鼻的铁锈味。",
      "",
      "围观的市民还在迟疑。",
      "有人举起手机拍照，有人往后退了几步，但没有人真正意识到危险。",
      "",
      "只有林雪变了脸色。",
      "\"这……这是什么？这不是普通的事故！\"",
      "她的声音在发抖。",
      "",
      "诡物的轮廓从缝隙里完全滑了出来。",
      "像一只被泡得发白的巨型人手。",
      "指尖的指甲比刀还长，每动一下就在地面上划出半米深的沟痕。",
      "",
      "陈野没有犹豫。掌心的纹路爆发成一道光柱。",
      "【斩神系统】\n目标：一级诡物·灰手型\n预计斩神值：+15",
      "",
      "数据面板在他视网膜上展开。",
      "周围的人群还没散完，他不能在这里爆发全部力量。",
      "但那只手已经锁定了他。不杀诡物，它就会开始杀人。",
      "",
      "\"所有人都别靠近！\"",
      "陈野的声音让林雪愣在原地。",
      "她看着这个曾经在自己家做了三年饭的男人，第一次露出了不认识的表情。"
    ],

    // 审稿结果
    review: [
      "【审稿报告】",
      "",
      "1. 爽点评分：★★★★☆（8/10）",
      "   开局诡门降临+系统绑定节奏紧凑，300字内冲突到位。",
"   前妻林雪的「离婚-震惊」情绪弧有拉扯感。",
      "",
      "2. 节奏问题：无重大问题",
      "   每段1-3句符合番茄短段落规范。",
      "   建议：第6段可增加1句环境描写过渡。",
      "",
      "3. 逻辑问题：无",
      "   诡门→系统激活→官方监控的因果链清晰。",
      "",
      "4. 人物动机问题：林雪态度转变微快",
      "   从\"语气冷得像刀\"到\"声音发抖\"的跨度在600字内完成。",
      "   建议加1-2句内心过渡。",
      "",
      "5. 重复段落：无",
      "",
      "6. 修改建议：第8段\"路人的反应\"可以强化——",
      "   不只是拍照，可以加\"有人拨了110说天空裂了，接线员以为恶作剧\""
    ],

    // 连续性检测
    continuity: [
      "【连续性检测报告】",
      "",
      "1. 情节衔接：✅ 合格",
      "   前一章结尾\"掌心浮现血色纹路\"→本章\"纹路爆发成光柱\"衔接自然。",
      "",
      "2. 人物状态一致性：✅ 合格",
      "   陈野：隐忍→觉醒战斗状态过渡合理。",
      "   林雪：傲慢→震惊符合前文\"废物赘婿\"人设反转。",
      "",
      "3. 时间线连贯性：✅ 合格",
      "   事件发生在民政局门口，时间连续无跳跃。",
      "",
      "4. 世界观规则：✅ 合格",
      "   诡门等级、斩神值系统、数据面板均已建立并保持一致。",
      "",
      "5. 衔接修复建议：无断裂，保持当前节奏。",
      "",
      "6. 下一章节钩子建议：",
      "   本章结尾\"数据面板展开\"→下一章可展开\"首次任务引导\"",
      "   同时切割到\"特别调查局监控室\"视角，制造双线悬念。"
    ],

    // 大纲
    outline: JSON.stringify({
      mainOutline: "离婚当天觉醒斩神系统 → 处理城市诡灾 → 卷入调查局暗线 → 揭开诡神真相 → 完成镇国斩神",
      stages: [
        { title: "第一阶段：觉醒与复仇", range: "1-50章", summary: "离婚羞辱、系统绑定、首杀诡物、前妻家族危机、官方初步接触" },
        { title: "第二阶段：城市暗流", range: "51-150章", summary: "调查局入职、城市诡门连环爆发、反派组织初现、个人战力突破S级" },
        { title: "第三阶段：国门危机", range: "151-280章", summary: "诡神真身显现、国际觉醒者联盟介入、主角身份暴露、最终决战" }
      ],
      volumes: [
        { title: "第一卷 赘婿觉醒", summary: "离婚→诡门→系统→首杀→前妻震惊", chapters: [
          { title: "第1章 离婚当天，诡门降临", beat: "民政局离婚现场，天空裂开，系统激活" },
          { title: "第2章 第一只诡物", beat: "路人以为是幻觉，主角首杀诡物获得斩神值" },
          { title: "第3章 系统的真相", beat: "数据面板揭示系统来源，官方监控捕捉异常信号" }
        ]},
        { title: "第二卷 城市暗流", summary: "前妻家族危机→调查局招揽→第一批敌人", chapters: [
          { title: "第4章 前妻一家后悔了", beat: "林家产业遭遇诡门污染，林父被迫放下身段" },
          { title: "第5章 调查局来人", beat: "顾青瓷带人封锁现场，确认主角为野生觉醒者" }
        ]}
      ]
    }),

    // 扫榜分析结果
    scanResult: [
      "📊 番茄小说热榜分析（演示数据）",
      "",
      "🏆 本周 TOP10 题材分布：",
      "  1. 都市异能（诡门/系统/灵气复苏）—— 4本",
      "  2. 赘婿逆袭 —— 3本",
      "  3. 年代重生 —— 2本",
      "  4. 玄幻玄幻 —— 1本",
      "",
      "📈 趋势洞察：",
      "  • 「诡门+系统」组合题材近30天搜索量上升 67%",
      "  • 开局300字内有\"离婚/羞辱\"情节的留存率比同类高 22%",
      "  • 短段落（每段≤3句）+高频空行的格式成为头部标配",
      "",
      "🎯 与你作品《离婚当天，我觉醒了镇国斩神系统》的匹配度：",
      "  ▸ 题材契合度：★★★★★（诡门+系统+赘婿三重热度覆盖）",
      "  ▸ 差异化空间：多数竞品停留在\"都市\"，缺少\"镇国\"格局 → 这是你的优势",
      "",
      "💡 建议：突出\"从私人复仇到国家安全\"的升级线，这是竞品盲区。"
    ],

    // 文笔分析结果
    styleResult: [
      "✍️ 文笔风格分析（演示数据）",
      "",
      "📝 当前风格特征：",
      "  • 段落长度：1-3句（✅ 符合番茄短段落标准）",
      "  • 对话占比：~35%（理想值 40-50%，可略微增加对话密度）",
      "  • 环境描写：偏少（每1000字约1-2处，建议增至3-4处）",
      "  • 情绪词密度：中等（可强化\"震惊/恐惧/爽感\"三类情绪词）",
      "",
      "🎨 参考风格建议（来自头部作品）：",
      "  ▸ 《诡秘之主》风格：环境渲染+诡异氛围，适合诡域场景",
      "  ▸ 《我有一座恐怖屋》风格：短促对话+突然惊吓，适合诡物出场",
      "  ▸ 番茄头部赘婿文：每500字一个反转勾子，爽感密集投放",
      "",
      "⚡ 具体改进：",
      "  1. 诡物出场时加1-2句感官描写（味道/温度/声音）",
      "  2. 每300字后用一个\"！\"或\"——\"制造节奏切断",
      "  3. 系统通知用独立段落，加粗显示（番茄阅读器支持）",
      "",
      "📊 番茄适读性评分：8.5/10"
    ],

    // 章节命名
    title: "第{num}章 诡门异变"
  };

  /* ── 智能响应匹配 ── */
  function matchResponse(messages) {
    if (!messages || !messages.length) return MOCK_RESPONSES.chapter;

    const userContent = (messages.find(m => m.role === "user")?.content || "").toLowerCase();
    const sysContent = (messages.find(m => m.role === "system")?.content || "").toLowerCase();

    if (userContent.includes("审稿") || sysContent.includes("审稿")) return MOCK_RESPONSES.review;
    if (userContent.includes("连续性") || sysContent.includes("连续性")) return MOCK_RESPONSES.continuity;
    if (userContent.includes("大纲") || sysContent.includes("大纲") || userContent.includes("json")) return MOCK_RESPONSES.outline;
    if (userContent.includes("排行榜") || userContent.includes("扫榜") || userContent.includes("趋势")) return MOCK_RESPONSES.scanResult;
    if (userContent.includes("文笔") || userContent.includes("风格") || userContent.includes("分析")) return MOCK_RESPONSES.styleResult;
    if (userContent.includes("起名") || userContent.includes("命名") || userContent.includes("章节名")) return MOCK_RESPONSES.title;

    return MOCK_RESPONSES.chapter;
  }

  function formatResponse(content, messages) {
    if (Array.isArray(content)) return content.join("\n");
    // 章节命名：尝试提取编号
    if (typeof content === "string" && content.includes("{num}")) {
      const userMsg = (messages || []).find(m => m.role === "user")?.content || "";
      const numMatch = userMsg.match(/第(\d+)章/);
      return content.replace("{num}", numMatch ? numMatch[1] : "N");
    }
    return content;
  }

  /* ── window.novelAPI mock ── */
  window.novelAPI = {
    isElectron: true,

    // API 状态
    getApiStatus: () => Promise.resolve({
      providerId: "stepfun",
      providerName: "StepFun 阶跃星辰（演示模式）",
      baseUrl: "https://api.stepfun.com/v1",
      model: "step-router-v1",
      keySaved: true,
      keyMasked: "demo-****-demo",
      status: "演示模式 · 无需真实 API",
    }),

    // API 测试
    testApi: () => new Promise(resolve => {
      setTimeout(() => resolve({
        ok: true,
        text: "演示模式：API 连接模拟成功。（真实部署时需配置 StepFun API Key）"
      }), 600);
    }),

    // 普通请求
    chat: (payload) => new Promise(resolve => {
      const matched = matchResponse(payload?.messages);
      const formatted = formatResponse(matched, payload?.messages);
      setTimeout(() => resolve({
        ok: true,
        text: typeof formatted === "string" ? formatted : (Array.isArray(formatted) ? formatted.join("\n") : formatted),
        raw: { choices: [{ message: { content: typeof formatted === "string" ? formatted : "" } }] }
      }), DEMO_DELAY);
    }),

    // 流式请求
    chatStream: (payload, onChunk) => {
      return new Promise(resolve => {
        const matched = matchResponse(payload?.messages);
        const formatted = formatResponse(matched, payload?.messages);
        const text = typeof formatted === "string" ? formatted : (Array.isArray(formatted) ? formatted.join("\n") : "");

        let fullText = "";
        let i = 0;
        const chars = [...text]; // 按字符拆分，支持中文

        function emitNext() {
          if (i >= chars.length) {
            resolve({ ok: true, text: fullText });
            return;
          }
          const char = chars[i];
          fullText += char;
          if (onChunk) {
            onChunk({ text: char, fullText });
          }
          i++;
          setTimeout(emitNext, CHUNK_DELAY);
        }
        setTimeout(emitNext, 200); // 初始延迟模拟网络请求
      });
    }
  };

  /* ── 也暴露 electronAPI 的兼容性别名 ── */
  window.electronAPI = window.novelAPI;

  /* ── 演示模式视觉标识 ── */
  const style = document.createElement("style");
  style.textContent = `
    .demo-banner {
      position: fixed; top: 0; left: 0; right: 0; z-index: 99999;
      background: linear-gradient(135deg, #f59e0b, #f97316);
      color: #fff; text-align: center; padding: 4px 12px;
      font-size: 12px; font-weight: 600;
      letter-spacing: 2px;
      pointer-events: none;
    }
    .demo-banner a { color: #fff; text-decoration: underline; pointer-events: auto; }
    body { padding-top: 28px !important; }
  `;
  document.head.appendChild(style);

  const banner = document.createElement("div");
  banner.className = "demo-banner";
  banner.innerHTML = "⚠️ 演示模式 — 所有 AI 功能返回预设内容，不可用于实际写作 ⚠️";
  // 等 body 存在再插入
  function insertBanner() {
    if (document.body) {
      document.body.insertBefore(banner, document.body.firstChild);
    } else {
      setTimeout(insertBanner, 10);
    }
  }
  insertBanner();

  console.log("[demo-mock] ✅ window.novelAPI 已注入（演示模式）");
})();
