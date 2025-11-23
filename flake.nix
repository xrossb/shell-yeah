{
  description = "Hell yeah, it's my desktop shell.";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

    astal = {
      url = "github:aylur/astal";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    astal-niri = {
      url = "github:sameoldlab/astal?ref=feat/niri";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.astal.follows = "astal";
    };
  };

  outputs = {nixpkgs, ...} @ inputs: let
    # Override nativeBuildInputs to replace wrapGAppsHook with wrapGAppsHook3.
    astal-niri = pkgs:
      inputs.astal-niri.packages.${pkgs.system}.niri.overrideAttrs
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

    eachSystem = fn:
      nixpkgs.lib.genAttrs nixpkgs.lib.platforms.linux (
        system:
          fn rec {
            pkgs = nixpkgs.legacyPackages.${system};
            astal = inputs.astal.packages.${system} // {niri = astal-niri pkgs;};
            ags = inputs.ags.packages.${system};
          }
      );

    packages = {
      pkgs,
      astal,
    }: [
      pkgs.glib
      pkgs.gjs
      pkgs.libadwaita
      astal.astal4
      astal.apps
      astal.io
      astal.notifd
      astal.tray
      astal.wireplumber
      astal.battery
      astal.bluetooth
      astal.network
      astal.niri
    ];
  in {
    formatter = eachSystem ({pkgs, ...}: pkgs.alejandra);

    packages = eachSystem ({
      pkgs,
      astal,
      ags,
      ...
    }: rec {
      default = shell-yeah;

      shell-yeah = pkgs.stdenv.mkDerivation rec {
        name = "shell-yeah";
        src = ./.;

        pnpmDeps = pkgs.pnpm.fetchDeps {
          inherit src;
          pname = name;
          fetcherVersion = 2;
          hash = "sha256-86YJtfgLT003beUrwnVOZyBj7L71RXJWTQ2CQTTh+Bg=";
        };

        nativeBuildInputs = [
          pkgs.wrapGAppsHook4
          pkgs.gobject-introspection
          pkgs.pnpm.configHook
          ags.default
        ];

        buildInputs = packages {inherit pkgs astal;};

        installPhase = ''
          mkdir -p $out/bin
          mkdir -p $out/share
          cp -r assets/* $out/share
          ags bundle app.ts $out/bin/shell-yeah -d "import.meta.PKG_DATADIR='$out/share'"
        '';
      };
    });

    devShells = eachSystem ({
      pkgs,
      astal,
      ags,
      ...
    }: {
      default = pkgs.mkShell {
        buildInputs = [
          (ags.default.override {
            extraPackages = packages {inherit pkgs astal;};
          })

          pkgs.entr
          pkgs.pnpm
        ];
      };
    });
  };
}
