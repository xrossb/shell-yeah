{
  description = "Hell yeah, it's my desktop shell.";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    libastal-niri = {
      url = "github:sameoldlab/astal?ref=feat/niri";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    self,
    nixpkgs,
    ags,
    libastal-niri,
  }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
    pname = "shell-yeah";
    entry = "app.ts";

    # Override nativeBuildInputs to replace wrapGAppsHook with wrapGAppsHook3.
    astalniri =
      libastal-niri.packages.${system}.niri.overrideAttrs
      (finalAttrs: prevAttrs: {
        nativeBuildInputs = with pkgs; [
          wrapGAppsHook4
          gobject-introspection
          meson
          pkg-config
          ninja
          vala
          wayland
          wayland-scanner
          python3
        ];
      });

    astalPackages = with ags.packages.${system}; [
      io
      astal4
      notifd
      tray
      wireplumber
      battery
      bluetooth
      network
    ];

    extraPackages =
      astalPackages
      ++ [
        astalniri
        pkgs.libadwaita
        pkgs.libsoup_3
      ];
  in {
    packages.${system} = {
      default = pkgs.stdenv.mkDerivation rec {
        name = pname;
        src = ./.;

        nativeBuildInputs = with pkgs; [
          wrapGAppsHook4
          gobject-introspection
          pkgs.pnpm.configHook
          ags.packages.${system}.default
        ];

        pnpmDeps = pkgs.pnpm.fetchDeps {
          inherit pname src;
          fetcherVersion = 2;
          hash = "sha256-86YJtfgLT003beUrwnVOZyBj7L71RXJWTQ2CQTTh+Bg=";
        };

        buildInputs = extraPackages ++ [pkgs.gjs];

        installPhase = ''
          runHook preInstall

          mkdir -p $out/bin
          mkdir -p $out/share
          cp -r * $out/share
          ags bundle ${entry} $out/bin/${pname} -d "SRC='$out/share'"

          runHook postInstall
        '';
      };
    };

    devShell.${system} = pkgs.mkShell {
      buildInputs = [
        (ags.packages.${system}.default.override {
          inherit extraPackages;
        })
        pkgs.entr
        pkgs.pnpm
      ];
    };
  };
}
