// components/class/WeatherIcon.tsx — 구간 날씨 아이콘 (학생·교실 화면은 숫자 대신 날씨로만 말한다, SPEC 5-0)
import type { Weather } from "@/lib/rules/bridge";

const SUN = "#d9a21b";
const CLOUD = "#c9ced4";
const DARK = "#5b6470";
const RAIN = "#2f7f86";

export function WeatherIcon({ weather, size = 56 }: { weather: Weather; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      {weather === "맑음" && (
        <g>
          <circle cx="32" cy="32" r="12" fill={SUN} />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            return (
              <line
                key={i}
                x1={(32 + Math.cos(a) * 18).toFixed(2)}
                y1={(32 + Math.sin(a) * 18).toFixed(2)}
                x2={(32 + Math.cos(a) * 25).toFixed(2)}
                y2={(32 + Math.sin(a) * 25).toFixed(2)}
                stroke={SUN}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            );
          })}
        </g>
      )}
      {weather === "구름" && (
        <g>
          <circle cx="24" cy="24" r="10" fill={SUN} />
          <Cloud fill={CLOUD} />
        </g>
      )}
      {(weather === "먹구름" || weather === "소나기") && <Cloud fill={DARK} />}
      {weather === "소나기" &&
        [20, 31, 42].map((x) => (
          <line key={x} x1={x} y1="48" x2={x - 4} y2="58" stroke={RAIN} strokeWidth="3.5" strokeLinecap="round" />
        ))}
    </svg>
  );
}

function Cloud({ fill }: { fill: string }) {
  return (
    <path
      d="M18 44h30a10 10 0 0 0 0-20 13 13 0 0 0-25-3 10 10 0 0 0-5 23z"
      fill={fill}
    />
  );
}

/** 학생·교실 화면용 한 줄 설명. 숫자를 쓰지 않는다 */
export const WEATHER_TEXT: Record<Weather, string> = {
  맑음: "다 이어졌어요",
  구름: "거의 이어졌어요",
  먹구름: "아직 물이 높아요",
  소나기: "함께 놓을 곳이에요",
};
