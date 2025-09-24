import React from "react";
import RevealText from "@/components/ui/RevealText";
import { GrainGradient } from "@paper-design/shaders-react";
import { Link000 } from "@/components/ui/skiper40";

const Hero = ({
  reveal,
  setReveal,
}: {
  reveal: boolean;
  setReveal: (value: boolean) => void;
}) => {
  return (
    <div className="h-full grid-col-1 max-w-[50rem] mx-auto flex items-center flex-col justify-center">
      <RevealText className="w-full mb-16">
        <svg
          className="w-full mb-16 size-[3rem]"
          width="304"
          height="64"
          viewBox="0 0 304 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="grainMask">
              <path
                d="M302.9 14.2435C183.251 137.982 97.0907 -16.386 1.10018 49.7565C120.749 -73.9818 206.909 80.386 302.9 14.2435Z"
                fill="white"
              />
            </clipPath>
          </defs>
          <foreignObject width="100%" height="100%" clipPath="url(#grainMask)">
            <GrainGradient
              style={{ height: "100%", width: "100%" }}
              colors={["#c6750c", "#beae60", "#d7cbc6"]}
              colorBack="#1a1300"
              softness={0}
              intensity={0.5}
              noise={0.24}
              shape="corners"
              offsetX={0.01}
              offsetY={0}
              scale={2.2}
              rotation={32}
              speed={2}
            />
          </foreignObject>
        </svg>
        <div className="flex flex-col gap-4">
          {/* <div className="flex items-center gap-1 w-full justify-center text-xl">
            <svg
              className="size-5"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_524_9)">
                <path
                  d="M0.873556 4.52148C0.433078 5.57737 1.19859 6.8518 2.31058 7.0752C1.44402 6.49328 0.902931 5.55842 0.873556 4.52148Z"
                  fill="white"
                />
                <path
                  d="M2.31023 7.07531L2.2832 7.06958C2.28658 7.07046 2.29466 7.07178 2.31023 7.07531Z"
                  fill="white"
                />
                <path
                  d="M0.293945 6.50085C0.365767 7.38504 1.47467 7.95168 2.27044 7.58949C1.45117 7.41353 0.907736 7.25241 0.293945 6.50085Z"
                  fill="white"
                />
                <path
                  d="M6.83044 3.34791C7.34627 2.29511 6.6138 0.992623 5.50049 0.709595C6.35222 1.33132 6.85747 2.29937 6.83044 3.34791Z"
                  fill="white"
                />
                <path
                  d="M7.17699 2.62148C7.79269 2.07672 7.54447 0.99293 6.83447 0.640137C7.17669 1.31062 7.29728 1.87697 7.17699 2.62148Z"
                  fill="white"
                />
                <path
                  d="M8.88866 2.10688C8.74936 2.0004 8.57886 1.94279 8.40353 1.94296C7.34515 1.94296 7.15539 3.32153 6.92053 3.85968C6.92053 3.85968 5.83527 1.58767 5.45781 0.838024C5.06859 0.0647277 4.23772 0.224528 3.99435 0.645471C3.41625 0.0463684 2.32394 0.530027 2.46318 1.25838C1.71353 1.20081 1.41052 1.94032 1.57693 2.41443C0.997511 2.39651 0.726674 3.11312 0.922605 3.62615C0.932739 3.65288 1.96145 5.67741 2.23846 6.36713C2.27062 6.44718 2.30308 6.5328 2.33716 6.62299C2.56114 7.21519 2.86796 8.02623 3.63553 8.67762C3.966 8.958 4.42351 9.1062 4.95902 9.1062C5.90284 9.1062 6.95373 8.63782 7.6364 7.91269C8.24784 7.26336 8.54086 6.46627 8.48387 5.60749C8.43276 4.83552 8.67833 4.10819 8.87558 3.52363C9.08958 2.88928 9.25849 2.38814 8.88866 2.10688ZM8.01519 5.58194C8.1346 7.2898 6.42277 8.73079 4.97048 8.73079C4.52677 8.73079 4.0672 8.65911 3.78006 8.41545C2.95667 7.71662 2.75002 6.85182 2.51135 6.25874C2.22627 5.54918 1.52655 4.18574 1.18742 3.49984C1.04862 3.21901 1.28054 2.62138 1.68444 2.62138L2.84931 5.09886L3.29067 5.36383C3.29067 5.36383 2.27988 3.161 1.95983 2.4018C1.77301 1.95853 2.09496 1.42332 2.52883 1.49309L3.97496 4.57981L4.41646 4.84536L2.73093 1.28614C2.72417 0.655312 3.58736 0.645471 3.78799 1.01383C4.29573 1.9462 5.24895 3.99231 5.24895 3.99231L5.69016 4.25771L4.10788 0.902649C4.4169 0.498156 4.9621 0.554849 5.1971 1.04585C5.4794 1.63555 6.67481 4.19691 6.67481 4.19691C5.49467 4.63929 4.68906 5.92166 5.53257 7.18581C4.86326 5.80372 6.04898 4.827 6.74942 4.50417C7.01453 4.38182 7.11206 4.15049 7.11206 4.15049L7.11147 4.15064C7.20385 3.98335 7.19842 3.75966 7.30858 3.39761C7.54725 2.61404 7.87463 2.19882 8.35506 2.19882C8.4658 2.19882 8.60533 2.28166 8.66937 2.3761C8.99294 2.85359 7.90415 3.9951 8.01519 5.58194Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_524_9">
                  <rect width="9.4" height="9.4" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <p className="text-white">Sanka</p>
          </div> */}
          <p className="text-xs text-center text-neutral-600">
            Think it, speak it, ship it. Sanka compresses the entire builder
            workflow into a conversation — code scaffolds, GitHub push, and
            Vercel deploys — so you can move from idea to live product without
            touching a terminal.
          </p>
          <div className="w-full flex justify-center">
            <button onClick={() => setReveal(!reveal)}>
              <Link000 className="flex items-center gap-2 cursor-pointer">
                <p className="">Get started</p>
                <svg
                  width="16"
                  height="8"
                  viewBox="0 0 16 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 3.5C0.723858 3.5 0.5 3.72386 0.5 4C0.5 4.27614 0.723858 4.5 1 4.5V4V3.5ZM15.3536 4.35355C15.5488 4.15829 15.5488 3.84171 15.3536 3.64645L12.1716 0.464466C11.9763 0.269204 11.6597 0.269204 11.4645 0.464466C11.2692 0.659728 11.2692 0.976311 11.4645 1.17157L14.2929 4L11.4645 6.82843C11.2692 7.02369 11.2692 7.34027 11.4645 7.53553C11.6597 7.7308 11.9763 7.7308 12.1716 7.53553L15.3536 4.35355ZM1 4V4.5H15V4V3.5H1V4Z"
                    fill="white"
                  />
                </svg>
              </Link000>
            </button>
          </div>
        </div>
      </RevealText>
    </div>
  );
};

export default Hero;
