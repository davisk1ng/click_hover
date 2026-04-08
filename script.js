$(function () {
    if ($("body").hasClass("page-1")) {
        const $canvas = $("#hover-canvas");

        $("#ground-trigger").hover(
            function () {
                $canvas.addClass("is-blooming");

                $(this).css("background", "#4f8d56");
                $(".stem").stop().animate({ height: "150px" }, 700);
                $(".leaf-left").stop().animate({ width: "48px", height: "24px", top: "116px", left: "46px", opacity: 1 }, 600);
                $(".leaf-right").stop().animate({ width: "48px", height: "24px", top: "96px", left: "106px", opacity: 1 }, 600);
                $(".bloom-core").stop().animate({ top: "58px", left: "81px", width: "38px", height: "38px", opacity: 1 }, 650);
                $(".petal-1").stop().animate({ top: "26px", left: "78px", width: "44px", height: "52px", opacity: 1 }, 650);
                $(".petal-2").stop().animate({ top: "52px", left: "48px", width: "46px", height: "42px", opacity: 1 }, 650);
                $(".petal-3").stop().animate({ top: "52px", left: "106px", width: "46px", height: "42px", opacity: 1 }, 650);
                $(".petal-4").stop().animate({ top: "82px", left: "78px", width: "44px", height: "48px", opacity: 1 }, 650);
            },
            function () {
                $canvas.removeClass("is-blooming");

                $(this).css("background", "#2f6639");
                $(".stem").stop().animate({ height: "0px" }, 650);
                $(".leaf-left").stop().animate({ width: "0px", height: "0px", top: "156px", left: "92px", opacity: 0 }, 500);
                $(".leaf-right").stop().animate({ width: "0px", height: "0px", top: "156px", left: "96px", opacity: 0 }, 500);
                $(".bloom-core").stop().animate({ top: "168px", left: "92px", width: "12px", height: "12px", opacity: 0 }, 500);
                $(".petal").stop().animate({ top: "168px", left: "92px", width: "0px", height: "0px", opacity: 0 }, 500);
            }
        );
    }

    if ($("body").hasClass("page-2")) {
        const $stage = $("#firework-stage");
        const colors = ["#ffcf5a", "#ff6ec7", "#6ef0c2", "#64d2ff", "#b69cff", "#ff8c55"];

        function launchFirework(event) {
            const offset = $stage.offset();
            const burstX = event.pageX - offset.left;
            const burstY = event.pageY - offset.top;
            const $burst = $('<div class="firework-burst"><span class="firework-core"></span></div>').css({
                left: burstX,
                top: burstY
            });

            for (let i = 0; i < 18; i += 1) {
                const angle = (Math.PI * 2 * i) / 18;
                const distance = 55 + Math.random() * 85;
                const size = 6 + Math.random() * 8;
                const color = colors[(i + Math.floor(Math.random() * colors.length)) % colors.length];
                const $spark = $('<span class="spark"></span>').css({
                    width: size,
                    height: size,
                    background: color,
                    color: color
                });

                $burst.append($spark);
                $spark.animate({
                    left: Math.cos(angle) * distance,
                    top: Math.sin(angle) * distance,
                    opacity: 0
                }, 850 + Math.random() * 220);
            }

            $stage.append($burst);
            $burst.find(".firework-core").animate({
                width: "6px",
                height: "6px",
                marginLeft: "-3px",
                marginTop: "-3px",
                opacity: 0
            }, 320);

            window.setTimeout(function () {
                $burst.remove();
            }, 1200);
        }

        $stage.on("click", launchFirework);
    }

    if ($("body").hasClass("page-3")) {
        const $window = $(window);
        const $scene = $("#root-scene");
        const $main = $("#root-main");
        const $tip = $("#root-tip-shape");
        const driftPattern = [0, 1, 2, 2, 1, 0, -1, -2, -2, -1, 0, 1, 3, 3, 2, 1, 0, -1, -3, -3, -2, -1];
        const segmentStep = 22;
        const branchConfigs = [
            { selector: "#root-branch-1", threshold: 0.12, growthSpan: 0.1, anchorStep: 6, endX: -150, endY: 116, curveX: -62, curveY: 34 },
            { selector: "#root-branch-2", threshold: 0.24, growthSpan: 0.1, anchorStep: 11, endX: 170, endY: 132, curveX: 72, curveY: 38 },
            { selector: "#root-branch-3", threshold: 0.38, growthSpan: 0.11, anchorStep: 17, endX: -138, endY: 108, curveX: -58, curveY: 30 },
            { selector: "#root-branch-4", threshold: 0.52, growthSpan: 0.11, anchorStep: 23, endX: 182, endY: 122, curveX: 78, curveY: 36 },
            { selector: "#root-branch-5", threshold: 0.68, growthSpan: 0.12, anchorStep: 30, endX: -164, endY: 134, curveX: -66, curveY: 40 },
            { selector: "#root-branch-6", threshold: 0.82, growthSpan: 0.12, anchorStep: 36, endX: 148, endY: 112, curveX: 60, curveY: 34 }
        ];

        function updateRoot() {
            const scrollRange = $(document).height() - $window.height();
            const progress = scrollRange > 0 ? Math.min($window.scrollTop() / scrollRange, 1) : 0;
            const maxHeight = Math.max($scene.outerHeight() - 140, 80);
            const totalLength = 36 + progress * (maxHeight - 36);
            const steps = Math.max(2, Math.floor(totalLength / segmentStep));
            const points = [{ x: 500, y: 0 }];
            let currentX = 500;
            let currentY = 0;

            for (let i = 0; i < steps; i += 1) {
                const offsetDelta = driftPattern[i % driftPattern.length] * 5;
                currentX = Math.max(400, Math.min(600, currentX + offsetDelta));
                currentY += segmentStep;
                points.push({ x: currentX, y: currentY });
            }

            const mainPath = points
                .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
                .join(" ");

            $main.attr("d", mainPath);

            const lastPoint = points[points.length - 1];
            const prevPoint = points[points.length - 2] || points[0];
            const angle = Math.atan2(lastPoint.y - prevPoint.y, lastPoint.x - prevPoint.x);
            const tipLength = 20;
            const tipWidth = 7;
            const baseX = lastPoint.x - Math.cos(angle) * tipLength;
            const baseY = lastPoint.y - Math.sin(angle) * tipLength;
            const perpX = -Math.sin(angle) * tipWidth;
            const perpY = Math.cos(angle) * tipWidth;

            $tip.attr(
                "points",
                `${lastPoint.x},${lastPoint.y} ${baseX + perpX},${baseY + perpY} ${baseX - perpX},${baseY - perpY}`
            );

            branchConfigs.forEach((branch) => {
                const $branch = $(branch.selector);
                const anchorIndex = Math.min(branch.anchorStep, points.length - 1);
                const anchor = points[anchorIndex];

                if (anchor) {
                    const branchPath = `M ${anchor.x} ${anchor.y} Q ${anchor.x + branch.curveX} ${anchor.y + branch.curveY}, ${anchor.x + branch.endX} ${anchor.y + branch.endY}`;
                    const localProgress = Math.max(0, Math.min((progress - branch.threshold) / (branch.growthSpan || 0.16), 1));

                    $branch.attr("d", branchPath);

                    if (localProgress > 0) {
                        const branchLength = $branch[0].getTotalLength();
                        $branch
                            .addClass("visible")
                            .css({
                                strokeDasharray: branchLength,
                                strokeDashoffset: branchLength * (1 - localProgress)
                            });
                    } else {
                        $branch
                            .removeClass("visible")
                            .css({
                                strokeDasharray: 0,
                                strokeDashoffset: 0
                            });
                    }
                } else {
                    $branch.attr("d", "").removeClass("visible").css({
                        strokeDasharray: 0,
                        strokeDashoffset: 0
                    });
                }
            });
        }

        $window.on("scroll resize", updateRoot);
        updateRoot();
    }

});