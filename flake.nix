{
  description = "Hell yeah, it's my desktop shell.";

  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
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

  outputs = inputs @ {flake-parts, ...}:
    flake-parts.lib.mkFlake {inherit inputs;} {
      imports = [
        ./nix/shell.nix
        ./nix/package.nix
      ];
      systems = [
        "x86_64-linux"
      ];
      perSystem = {pkgs, ...}: {
        formatter = pkgs.alejandra;
      };
    };

  # outputs = {
  #   self,
  #   nixpkgs,
  #   ags,
  # }: let
  #   system = "x86_64-linux";
  #   pkgs = nixpkgs.legacyPackages.${system};
  #   pname = "my-shell";
  #   entry = "app.ts";

  #   astalPackages = with ags.packages.${system}; [
  #     io
  #     astal4 # or astal3 for gtk3
  #     # notifd tray wireplumber
  #   ];

  #   extraPackages =
  #     astalPackages
  #     ++ [
  #       pkgs.libadwaita
  #       pkgs.libsoup_3
  #     ];
  # in {
  #   packages.${system} = {
  #     default = pkgs.stdenv.mkDerivation {
  #       name = pname;
  #       src = ./.;

  #       nativeBuildInputs = with pkgs; [
  #         wrapGAppsHook3
  #         gobject-introspection
  #         ags.packages.${system}.default
  #       ];

  #       buildInputs = extraPackages ++ [pkgs.gjs];

  #       installPhase = ''
  #         runHook preInstall

  #         mkdir -p $out/bin
  #         mkdir -p $out/share
  #         cp -r * $out/share
  #         ags bundle ${entry} $out/bin/${pname} -d "SRC='$out/share'"

  #         runHook postInstall
  #       '';
  #     };
  #   };

  #   devShells.${system} = {
  #     default = pkgs.mkShell {
  #       buildInputs = [
  #         (ags.packages.${system}.default.override {
  #           inherit extraPackages;
  #         })
  #       ];
  #     };
  #   };
  # };
}
